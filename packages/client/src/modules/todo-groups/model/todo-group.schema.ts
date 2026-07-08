import { createTodoGroupSchema } from "types";

export const createTodoGroupFormSchema = createTodoGroupSchema.omit({
  id: true,
  userId: true,
});
