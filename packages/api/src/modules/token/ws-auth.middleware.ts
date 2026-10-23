import { Injectable, Logger } from "@nestjs/common";
import { ExtendedError, Socket } from "socket.io";
import { extractTokenFromSocket } from "./helpers/exctractTokenFromSocket.js";
import { TokenService } from "./token.service.js";
import { UnauthorizedError } from "../../classes/app.error.js";
import { WsSessionService } from "../infra/ws-session/ws-session.service.js";

@Injectable()
export class WsAuthMiddleware {
  constructor(
    private readonly tokenService: TokenService,
    private readonly wsSessionService: WsSessionService,
  ) { }

  logger = new Logger(WsAuthMiddleware.name)

  use = async (socket: Socket, next: (err?: ExtendedError) => void) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie;
      const token = extractTokenFromSocket(socket);
      let userId: string | undefined;

      if (token) {
        try {
          const tokenPayload = await this.tokenService.validateAuthToken(token);
          userId = tokenPayload.userId;
        } catch {
          // Access token might be expired
        }
      }

      if (!userId && cookieHeader) {
        const cookies = Object.fromEntries(
          cookieHeader.split(";").map((c) => {
            const [key, ...rest] = c.trim().split("=");
            return [key, rest.join("=")];
          }),
        );
        const refreshToken = cookies["refreshToken"];
        if (refreshToken) {
          try {
            const refreshPayload = this.tokenService.validateRefreshToken(refreshToken);
            userId = refreshPayload.userId;
          } catch { }
        }
      }

      this.logger.log(userId)

      if (!userId) {
        return next(new UnauthorizedError("UNAUTHORIZED"));
      }

      socket.data.userId = userId;
      await this.wsSessionService.registerSocket(
        userId,
        socket.id,
      );

      socket.on("disconnect", async () => {
        await this.wsSessionService.unregisterSocket(
          userId!,
          socket.id,
        );
      });
      next();
    } catch (error) {
      next(new UnauthorizedError("UNAUTHORIZED"));
    }
  };
}
