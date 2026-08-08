import { createTodoGroupBodySchema } from "types";

export const createTodoGroupFormSchema = createTodoGroupBodySchema.omit({
  workspaceId: true
});
