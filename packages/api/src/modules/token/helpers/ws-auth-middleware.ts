import { extractTokenFromSocket } from "./exctractTokenFromSocket.js";
import { UnauthorizedException } from "@nestjs/common";
import { DefaultEventsMap, ExtendedError, Socket } from "socket.io";

export async function wsAuthMiddleware(
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  next: (err?: ExtendedError | undefined) => void,
) {
  try {
    const token = extractTokenFromSocket(socket);
    if (!token) {
      throw new UnauthorizedException("No token provided");
    }
    const tokenPayload = await this.tokenService.validateAuthToken(token);
    socket.data.userId = tokenPayload.userId;
    next();
  } catch (error) {

    next(error);
  }
}
