import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service.js";
import { Prisma, Status } from "generated/prisma/client.js";
import { CreateTodoDto } from "./dto/todo.dto.js";
import { EXTENDED_TODO_SELECT } from "./dto/todo.constants.js";
import { TExtendedTodo } from "types";

@Injectable()
export class TodoRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(args: Prisma.TodoCreateArgs) {
    return this.prisma.todo.create(args);
  }

  async createExtendedTask(dto: CreateTodoDto, currentUserId: string) {
    const { assigneeId, ...todoData } = dto;

    return await this.create({
      data: {
        ...todoData,
        userId: currentUserId,
        assigneeId: assigneeId ?? currentUserId,
      },
      select: EXTENDED_TODO_SELECT,
    });
  }

  async findMany(args: Prisma.TodoFindManyArgs) {
    return this.prisma.todo.findMany(args);
  }

  async findOne(args: Prisma.TodoFindUniqueArgs) {
    return this.prisma.todo.findUnique(args);
  }

  async count(args: Prisma.TodoCountArgs) {
    return this.prisma.todo.count(args);
  }

  async deleteMany(args: Prisma.TodoDeleteManyArgs) {
    return this.prisma.todo.deleteMany(args);
  }

  async update(id: string, data: Prisma.TodoUpdateInput) {
    return this.prisma.todo.update({
      where: { id },
      data,
    });
  }

  async updateStatus(id: string, status: Status) {
    return this.prisma.todo.update({
      where: { id },
      data: { status },
    });
  }

  async delete(id: string) {
    return this.prisma.todo.delete({
      where: { id },
    });
  }
}
