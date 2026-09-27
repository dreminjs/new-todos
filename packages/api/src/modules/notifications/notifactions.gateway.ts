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
import { WsSessionService } from "../infra/ws-session/ws-session.service.js";
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
  private readonly logger = new Logger(NotificationsGateway.name);

  constructor(
    private readonly wsAuthMiddleware: WsAuthMiddleware,
    private readonly wsSessionService: WsSessionService,
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    server.use(this.wsAuthMiddleware.use);
  }

  async handleConnection(client: Socket) {
    const userId = client.data.userId;

    if (!userId) {
      client.disconnect();
      return;
    }

    await this.wsSessionService.registerSocket(userId, client.id);
    client.join(`room-notification-${userId}`);
  }

  async handleDisconnect(client: Socket) {
    const userId = client.data.userId;

    if (userId) {
      await this.wsSessionService.unregisterSocket(userId, client.id);
    }

  }

  async sendNotification(userId: string, payload: TCreateNotification) {
    return this.server
      .to(`room-notification-${userId}`)
      .emit("notifications", payload);
  }
}
