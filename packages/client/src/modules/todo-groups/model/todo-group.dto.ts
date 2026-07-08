import type z from "zod";
import { createTodoGroupFormSchema } from "./todo-group.schema";
import type { TTodoGroup } from "types";

export type TCreateTodoGroupForm = z.infer<typeof createTodoGroupFormSchema>;

export type TCreateTodoGroupContext = Omit<TTodoGroup, "name">;
