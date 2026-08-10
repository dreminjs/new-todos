import { createZodDto } from "nestjs-zod";
import {
  createTodoGroupBodySchema,
  updateTodoGroupBodySchema,
  type TCreateTodoGroupBody,
  type TUpdateTodoGroupBody,
} from "types";

export class CreateTodoGroup extends createZodDto(createTodoGroupBodySchema) {}

export class UpdateTodoGroup extends createZodDto(updateTodoGroupBodySchema) {}

export type TCreateTodoGroupDto = TCreateTodoGroupBody & { userId: string };
export type TUpdateTodoGroupDto = TUpdateTodoGroupBody
