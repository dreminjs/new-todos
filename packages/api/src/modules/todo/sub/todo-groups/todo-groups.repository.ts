import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service.js";
import { Prisma, TodoGroup } from "generated/prisma/client.js";
import { TCreateTodoGroupDto, UpdateTodoGroup } from "./dto/todo-groups.dto.js";

@Injectable()
export class TodoGroupsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: TCreateTodoGroupDto): Promise<TodoGroup> {
    return this.prisma.todoGroup.create({
      data: {
        name: dto.name,
        workspaceId: dto.workspaceId,
        todoGroupParticipants: {
          create: {
            user: {
              connect: { id: dto.userId },
            },
          },
        },
      },
    });
  }

  async findMany(
    where: Prisma.TodoGroupWhereInput,
    include?: Prisma.TodoGroupInclude,
  ): Promise<TodoGroup[]> {
    return this.prisma.todoGroup.findMany({
      where,
      include,
    });
  }

  async findOne(args: Prisma.TodoGroupFindUniqueArgs) {
    return this.prisma.todoGroup.findUnique(args);
  }

  async update(id: string, dto: UpdateTodoGroup): Promise<TodoGroup> {
    return this.prisma.todoGroup.update({
      where: { id },
      data: {
        name: dto.name,
      },
    });
  }

  async delete(id: string): Promise<TodoGroup> {
    return this.prisma.todoGroup.delete({
      where: { id },
    });
  }
}
