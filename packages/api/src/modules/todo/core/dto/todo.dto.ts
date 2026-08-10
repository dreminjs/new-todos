import { createZodDto } from "nestjs-zod";
import {
  findTodosSchema,
  joinGroupTodosRoomSchema,
  updateTodoStatusSchema,
} from "types";
import {
  createTodoSchema,
  findMyDayTodosSchema,
  todoCountInfoSchema,
  updateTodoSchema,
} from "./todo.schema.js";
import z from "zod";

export class CreateTodoDto extends createZodDto(createTodoSchema) {}

export class FindTodoQueryParamsDto extends createZodDto(findTodosSchema) {}

export class UpdateTodoStatusDto extends createZodDto(updateTodoStatusSchema) {}

export class FindMyDayDto extends createZodDto(findMyDayTodosSchema) {}

export class UpdateTodoDto extends createZodDto(updateTodoSchema) {}

export type TTodoCountInfo = z.infer<typeof todoCountInfoSchema>;

export class JoinGroupTodosRoomDto extends createZodDto(
  joinGroupTodosRoomSchema,
) {}
