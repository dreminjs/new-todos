import z from "zod";
import { todoFormSchema } from "./todo.schema";

export const buildTodoFormSchema = (planned: boolean) => {
  console.log(planned, "is planned");
  return todoFormSchema.extend({
    deadline: planned
      ? z.date({ error: "Enter deadline" })
      : z.date().nullable().optional(),
  });
};

export type TCreateTodoForm = z.infer<ReturnType<typeof buildTodoFormSchema>>;
