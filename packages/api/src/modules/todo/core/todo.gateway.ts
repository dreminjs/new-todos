import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import type { TExtendedTodo } from "types";
import { JoinGroupTodosRoomDto } from "./dto/todo.dto.js";
import { Logger } from "@nestjs/common";
import { wsAuthMiddleware } from "../../token/helpers/ws-auth-middleware.js";

@WebSocketGateway()
export class TodoGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  private logger = new Logger(TodoGateway.name);

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`client conntected`);
  }
  handleDisconnect(client: Socket) {
    this.logger.log(`client disconnected`);
  }
  afterInit(server: Server) {
    server.use(wsAuthMiddleware);
  }

  @SubscribeMessage("join-group-todos-room")
  handleJoinGroupTodosRoom(client: Socket, payload: JoinGroupTodosRoomDto) {
    const { todoGroupId } = payload;
    client.join(`group-todos-${todoGroupId}`);
  }

  @SubscribeMessage("todos")
  handleMessage(client: Socket, payload: TExtendedTodo) {
    return client
      .to(`group-todos-${payload.todoGroup?.id}`)
      .emit("todos", payload);
  }
}
