import { Module } from "@nestjs/common";
import { TodoController } from "./todo.controller.js";
import { TodoService } from "./todo.service.js";
import { PrismaModule } from "../../prisma/prisma.module.js";
import { TodoGateway } from "./todo.gateway.js";

@Module({
  imports: [PrismaModule],
  controllers: [TodoController],
  providers: [TodoService, TodoGateway],
  exports: [TodoService],
})
export class TodoModule {}
