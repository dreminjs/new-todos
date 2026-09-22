import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
  WsException,
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
import { WorkspaceParticipantService } from "../../workspace/sub/workspace-participant/workspace-participant.service.js";
@UseGuards(WsAccessTokenGuard)
@WebSocketGateway({ cors: true })
export class TodoGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  private logger = new Logger(TodoGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly wsAuthMiddleware: WsAuthMiddleware,
    private readonly workspaceParticipantService: WorkspaceParticipantService,
  ) {}

  afterInit(server: Server) {
    server.use(this.wsAuthMiddleware.use);
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage("join-group-todos-room")
  async handleJoinGroupTodosRoomMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: JoinGroupTodosRoomDto,
  ) {
    const { todoGroupId, workspaceId } = payload;
    const userId = client.data.userId;

    const isParticipant = await this.workspaceParticipantService.findOneByIdAndWorkspaceId(
      userId,
      workspaceId,
    );

    if (!isParticipant) {
      throw new WsException("You are not a participant of this workspace");
    }

    const room = this.getRoomName(todoGroupId, workspaceId);
    await client.join(room);
  }

  @SubscribeMessage("todo:drag-position")
  async handleMessageDragPosition(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: TodoDragPositionPayload,
  ) {
    const room = this.getRoomName(payload.todoGroupId, payload.workspaceId);
    this.assertClientInRoom(client, room);

    client.volatile.to(room).emit("todo:drag-position", payload);
  }

  @SubscribeMessage("todo:drag-end")
  async handleMessageDragEnd(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: TodoDragEndPayload,
  ) {
    const room = this.getRoomName(payload.todoGroupId, payload.workspaceId);
    this.assertClientInRoom(client, room);

    client.to(room).emit("todo:drag-end", payload);
  }

  async handleTodoAdded(
    where: { todoGroupId: string; workspaceId: string },
    payload: TExtendedTodo,
  ) {
    const room = this.getRoomName(where.todoGroupId, where.workspaceId);
    this.server.to(room).emit("todos", payload);
  }

  async handleTodoUpdated(
    where: { todoGroupId: string; workspaceId: string },
    payload: TExtendedTodo,
  ) {
    const room = this.getRoomName(where.todoGroupId, where.workspaceId);
    this.server.to(room).emit("todos:updated", payload);
  }

  async handleTodoDeleted(payload: WsTodoDeletedPayload) {
    const room = this.getRoomName(payload.todoGroupId, payload.workspaceId);
    this.server.to(room).emit("todos:delete", payload);
  }

  async handleTodoStatusChanged(
    where: { todoGroupId: string; workspaceId: string },
    payload: TExtendedTodo,
  ) {
    const room = this.getRoomName(where.todoGroupId, where.workspaceId);
    this.server.to(room).emit("todos:status-changed", payload);
  }

  private getRoomName(todoGroupId: string, workspaceId: string): string {
    return `todos-group-${todoGroupId}:workspace-${workspaceId}`;
  }

  private assertClientInRoom(client: Socket, room: string) {
    if (!client.rooms.has(room)) {
      throw new WsException("Forbidden: You must join the room first");
    }
  }
}
