import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import type {
  TExtendedTodo,
  TodoDragPositionPayload,
  WsTodoDeletedPayload,
  TodoDragEndPayload,
} from "types";
import { JoinGroupTodosRoomDto } from "./dto/todo.dto.js";
import { Logger, UseGuards } from "@nestjs/common";
import { WsAccessTokenGuard } from "../../token/guards/ws-access-token.guard.js";
import { WsAuthMiddleware } from "../../token/ws-auth.middleware.js";
@UseGuards(WsAccessTokenGuard)
@WebSocketGateway()
export class TodoGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(private readonly wsAuthMiddleware: WsAuthMiddleware) {}

  private logger = new Logger(TodoGateway.name);

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`client conntected`);
  }
  handleDisconnect(client: Socket) {
    this.logger.log(`client disconnected`);
  }
  afterInit(server: Server) {
    server.use(this.wsAuthMiddleware.use);
  }

  @SubscribeMessage("join-group-todos-room")
  handleJoinGroupTodosRoom(client: Socket, payload: JoinGroupTodosRoomDto) {
    const { todoGroupId, workspaceId } = payload;
    this.logger.log(`${client.id} - ${todoGroupId}, ${workspaceId}`);
    client.join(`todos-group-${todoGroupId}:workspace-${workspaceId}`);
  }

  @SubscribeMessage("todos:created")
  handleMessage(client: Socket, payload: TExtendedTodo) {
    return client
      .to(
        `todos-group-${payload.todoGroup!.id}:workspace-${payload.workspace!.id}`,
      )
      .emit("todos", payload);
  }

  async handleTodoAdded(
    where: { todoGroupId: string; workspaceId: string },
    payload: TExtendedTodo,
  ) {
    return this.server
      .to(`todos-group-${where.todoGroupId}:workspace-${where.workspaceId}`)
      .emit("todos", payload);
  }

  @SubscribeMessage("todos:updated")
  handleMessageTodoUpdated(client: Socket, payload: TExtendedTodo) {
    return client
      .to(
        `todos-group-${payload.todoGroup!.id}:workspace-${payload.workspace!.id}`,
      )
      .emit("todos:updated", payload);
  }

  handleTodoUpdated(payload: TExtendedTodo) {
    return this.server
      .to(
        `todos-group-${payload.todoGroup!.id}:workspace-${payload.workspace!.id}`,
      )
      .emit("todos:updated", payload);
  }

  @SubscribeMessage("todos:delete")
  async handleMeessageTodoDeleted(
    client: Socket,
    payload: WsTodoDeletedPayload,
  ) {
    return client
      .to(`todos-group-${payload.todoGroupId}:workspace-${payload.workspaceId}`)
      .emit("todos:delete", payload);
  }

  async handleTodoDeleted(payload: WsTodoDeletedPayload) {
    return this.server
      .to(`todos-group-${payload.todoGroupId}:workspace-${payload.workspaceId}`)
      .emit("todos:delete", payload);
  }

  @SubscribeMessage("todos:status-changed")
  async handleMessageTodoStatusChanged(client: Socket, payload: TExtendedTodo) {
    return client
      .to(
        `todos-group-${payload.todoGroup!.id}:workspace-${payload.workspace!.id}`,
      )
      .emit("todos:status-changed", payload);
  }

  handleTodoStatusChanged(payload: TExtendedTodo) {
    return this.server
      .to(
        `todos-group-${payload.todoGroup!.id}:workspace-${payload.workspace!.id}`,
      )
      .emit("todos:status-changed", payload);
  }

  @SubscribeMessage("todo:drag-position")
  handleDragPosition(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: TodoDragPositionPayload,
  ) {
    const room = `todos-group-${payload.todoGroupId}:workspace-${payload.workspaceId}`;
    client.volatile.to(room).emit("todo:drag-position", payload);
  }

  @SubscribeMessage("todo:drag-end")
  handleDragEndEvent(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: TodoDragEndPayload,
  ) {
    const room = `todos-group-${payload.todoGroupId}:workspace-${payload.workspaceId}`;
    client.to(room).emit("todo:drag-end", payload);
  }
}
