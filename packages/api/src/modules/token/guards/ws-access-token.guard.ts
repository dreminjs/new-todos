import { CanActivate, ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { TokenService } from "../token.service.js";
import { UserService } from "../../user/user.service.js";

@Injectable()
export class WsAccessTokenGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  private logger = new Logger(WsAccessTokenGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();
    const token = this.extractToken(client);

    if (!token) throw new WsException("Unauthorized");

    try {
      const payload = await this.tokenService.validateAuthToken(token);

      this.logger.log(`Validating token for user: ${payload.userId}`);

      const user = await this.userService.findOne({
        where: { id: payload.userId },
      });

      if (!user) throw new WsException("Unauthorized");

      this.logger.log(`User authenticated: ${user.id} { email: ${user.email} }`);
      client.data.user = user;
      return true;
    } catch {
      throw new WsException("Unauthorized");
    }
  }

  private extractToken(client: Socket): string | null {
    const cookieHeader = client.handshake.headers.cookie;
    if (cookieHeader) {
      const cookies = Object.fromEntries(
        cookieHeader.split(";").map((c) => c.trim().split("=")),
      );
      if (cookies["accessToken"]) return cookies["accessToken"];
    }

    return client.handshake.auth?.token ?? null;
  }
}
