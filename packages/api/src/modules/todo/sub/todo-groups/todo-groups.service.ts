import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service.js";
import { Prisma, TodoGroup } from "generated/prisma/client.js";
import {
  CreateTodoGroup,
  TCreateTodoGroupDto,
  UpdateTodoGroup,
} from "./dto/todo-groups.dto.js";
import { todoGroupSchema, TTodoGroup } from "types";
import { TodoGroupsRepository } from "./todo-groups.repository.js";
import { TodoService } from "../../core/todo.service.js";

@Injectable()
export class TodoGroupsService {
  constructor(
    private readonly todoGroupsRepository: TodoGroupsRepository,
  ) {}

  async createOne(dto: TCreateTodoGroupDto): Promise<TTodoGroup> {
    const todoGroup = await this.todoGroupsRepository.create(dto);
    return todoGroupSchema.parse(todoGroup);
  }

  async findMany(
    where: Prisma.TodoGroupWhereInput,
    include?: Prisma.TodoGroupInclude,
  ): Promise<TodoGroup[]> {
    return this.todoGroupsRepository.findMany(where, include);
  }

  async findOne(args: Prisma.TodoGroupFindUniqueArgs) {
    return this.todoGroupsRepository.findOne(args);
  }

  async updateOne(id: string, dto: UpdateTodoGroup): Promise<TTodoGroup> {
    const updatedTodoGroup = await this.todoGroupsRepository.update(id, dto);
    return todoGroupSchema.parse(updatedTodoGroup);
  }

  async deleteOne(id: string): Promise<TodoGroup> {
    return this.todoGroupsRepository.delete(id);
  }
}
