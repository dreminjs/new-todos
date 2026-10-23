import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { TokenService } from "../token.service.js";
import { UserService } from "../../user/user.service.js";
import * as cookie from "cookie";
import { Redis } from "ioredis";
import { InjectRedis } from "@nestjs-redis/client";

@Injectable()
export class WsAccessTokenGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  private logger = new Logger(WsAccessTokenGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();
    const token = this.extractToken(client);

    try {
      let userId: string | undefined;
      if (token) {
        try {
          const payload = await this.tokenService.validateAuthToken(token);
          userId = payload.userId;
        } catch {
          // Token expired, fallback to refreshToken
        }
      }

      if (!userId) {
        const cookieHeader = client.handshake.headers.cookie;
        if (cookieHeader) {
          const cookies = cookie.parseCookie(cookieHeader);
          if (cookies["refreshToken"]) {
            try {
              const refreshPayload = this.tokenService.validateRefreshToken(cookies["refreshToken"]);
              userId = refreshPayload.userId;
            } catch {}
          }
        }
      }

      if (!userId) throw new WsException("Unauthorized");

      const user = await this.userService.findOne({
        where: { id: userId },
      });

      if (!user) throw new WsException("Unauthorized");

      const socketId = client.id;

      await this.redis
        .multi()
        .sadd(`user-sockets:${user.id}`, socketId)
        .set(`socket:${socketId}`, user.id, "EX", 60 * 60 * 24)
        .exec();

      client.data.user = user;
      return true;
    } catch {
      throw new WsException("Unauthorized");
    }
  }

  private extractToken(client: Socket): string | null {
    const cookieHeader = client.handshake.headers.cookie;
    if (cookieHeader) {
      const cookies = cookie.parseCookie(cookieHeader);
      if (cookies["accessToken"]) return cookies["accessToken"];
    }

    return client.handshake.auth?.token ?? null;
  }
}
