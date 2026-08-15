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
import { CurrentWsUser } from "../user/decorators/user.ws.decorator.js";
import { TokenService } from "../token/token.service.js";
import { wsAuthMiddleware } from "../token/helpers/ws-auth-middleware.js";
import type { TCreateNotification, TNotification } from "types";
import { WsAuthMiddleware } from "../token/ws-auth.middleware.js";
@UseGuards(WsAccessTokenGuard)
@WebSocketGateway({
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
})
export class NotifactionsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly wsAuthMiddleware: WsAuthMiddleware,
  ) {}
  private logger = new Logger(NotifactionsGateway.name);

  @WebSocketServer()
  server: Server;

  @SubscribeMessage("notifications")
  async handleNotifications(
    client: Socket,
    @CurrentWsUser("id") userId: string,
    payload: TNotification,
  ) {
    return this.server
      .to(`room-notification-${userId}`)
      .emit("notifications", payload);
  }

  afterInit(server: Server) {
    server.use(this.wsAuthMiddleware.use);
  }

  handleConnection(client: Socket) {
    client.join(`room-notification-${client.data.userId}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  async sendNotifitacation(userId: string, payload: TCreateNotification) {
    return this.server
      .to(`room-notification-${userId}`)
      .emit("notifications", payload);
  }
}
