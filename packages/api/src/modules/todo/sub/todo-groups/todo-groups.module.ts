import { Module } from "@nestjs/common";
import { TodoGroupsController } from "./todo-groups.controller.js";
import { TodoGroupsService } from "./todo-groups.service.js";
import { PrismaModule } from "../../../prisma/prisma.module.js";
import { TodoGroupsRepository } from "./todo-groups.repository.js";

@Module({
  imports: [PrismaModule],
  controllers: [TodoGroupsController],
  providers: [TodoGroupsService, TodoGroupsRepository],
  exports: [TodoGroupsService],
})
export class TodoGroupsModule {}
