import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service.js";
import { Prisma, Status } from "generated/prisma/client.js";
import { CreateTodoDto } from "./dto/todo.dto.js";
import { EXTENDED_TODO_SELECT } from "./dto/todo.constants.js";
import { extendedTodoSchema, TExtendedTodo } from "types";

@Injectable()
export class TodoRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(args: Prisma.TodoCreateArgs) {
    return this.prisma.todo.create(args);
  }

  async createExtendedTask(
    dto: CreateTodoDto,
    currentUserId: string,
  ): Promise<TExtendedTodo> {
    const { assigneeId, ...todoData } = dto;

    return (await this.create({
      data: {
        ...todoData,
        userId: currentUserId,
        assigneeId: assigneeId ?? currentUserId,
        status: todoData.status ?? "PENDING",
      },
      select: EXTENDED_TODO_SELECT,
    })) as unknown as TExtendedTodo;
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

  async update(
    id: string,
    data: Prisma.TodoUpdateInput,
  ): Promise<TExtendedTodo> {
    const updatedTodo = await this.prisma.todo.update({
      where: { id },
      data,
      select: EXTENDED_TODO_SELECT,
    });

    return extendedTodoSchema.parse(updatedTodo);
  }

  async delete(id: string) {
    return this.prisma.todo.delete({
      where: { id },
    });
  }
}
