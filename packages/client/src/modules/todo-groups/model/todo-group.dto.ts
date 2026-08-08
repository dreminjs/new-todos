import type z from "zod";
import { createTodoGroupFormSchema } from "./todo-group.schema";

export type TCreateTodoGroupForm = z.infer<typeof createTodoGroupFormSchema>;

export type TCreateTodoGroupContext = {
  workspaceId: string;
  userId?: string
}
