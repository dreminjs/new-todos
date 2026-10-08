import { Injectable } from "@nestjs/common";
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
  ) {}

  use = async (socket: Socket, next: (err?: ExtendedError) => void) => {
    try {
      const token = extractTokenFromSocket(socket);
      if (!token) {
        return next(new UnauthorizedError("UNAUTHORIZED"));
      }
      const tokenPayload = await this.tokenService.validateAuthToken(token);
      socket.data.userId = tokenPayload.userId;
      await this.wsSessionService.registerSocket(
        tokenPayload.userId,
        socket.id,
      );

      socket.on("disconnect", async () => {
        await this.wsSessionService.unregisterSocket(
          tokenPayload.userId,
          socket.id,
        );
      });
      next();
    } catch (error) {
      next(new UnauthorizedError("UNAUTHORIZED"));
    }
  };
}
