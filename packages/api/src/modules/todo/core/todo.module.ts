import { Module } from "@nestjs/common";
import { TodoController } from "./todo.controller.js";
import { TodoService } from "./todo.service.js";
import { PrismaModule } from "../../prisma/prisma.module.js";
import { TodoGateway } from "./todo.gateway.js";
import { TodoRepository } from "./todo.repository.js";
import { WorkspaceParticipantModule } from "../../workspace/sub/workspace-participant/workspace-participant.module.js";
import { TokenModule } from "../../token/token.module.js";
import { UserModule } from "../../../modules/user/user.module.js";

@Module({
  imports: [PrismaModule, WorkspaceParticipantModule, TokenModule, UserModule],
  controllers: [TodoController],
  providers: [TodoService, TodoGateway, TodoRepository],
  exports: [TodoService],
})
export class TodoModule {}
