import type z from "zod";
import type { createTodoGroupFormSchema } from "./todo-group.schema";

export type TCreateTodoGroupForm = z.infer<typeof createTodoGroupFormSchema>;
