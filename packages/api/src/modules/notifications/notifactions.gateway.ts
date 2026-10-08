import { Logger, UnauthorizedException, UseGuards } from "@nestjs/common";
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { WsAccessTokenGuard } from "../token/guards/ws-access-token.guard.js";
import type { TCreateNotification, TNotification } from "types";
import { WsAuthMiddleware } from "../token/ws-auth.middleware.js";
@UseGuards(WsAccessTokenGuard)
@WebSocketGateway({
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
})
export class NotificationsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly wsAuthMiddleware: WsAuthMiddleware) {}

  @WebSocketServer()
  server: Server;

  private logger = new Logger(NotificationsGateway.name);

  afterInit(server: Server) {
    server.use(this.wsAuthMiddleware.use);
  }

  async handleConnection(client: Socket) {
    const userId = client.data.userId;

    if (!userId) {
      client.disconnect();
      return;
    }

    client.join(`room-notification-${userId}`);
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.data.userId}`);
  }

  async sendNotification(userId: string, payload: TCreateNotification) {
    return this.server
      .to(`room-notification-${userId}`)
      .emit("notifications", payload);
  }
}
