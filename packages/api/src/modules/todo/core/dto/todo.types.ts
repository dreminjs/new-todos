import { Prisma } from "generated/prisma/client.js";
import { EXTENDED_TODO_SELECT } from "./todo.constants.js";
import { TUpdateTodoStatusBody } from "types";

export interface TTodoParticipantIdResponse {
  todoParticipants: {
    user: {
      id: string;
    };
  }[];
}
export type PrismaExtendedTodo = Prisma.TodoGetPayload<{
  select: typeof EXTENDED_TODO_SELECT;
}>;

export type TUpdateTodoStatusDto = TUpdateTodoStatusBody & { userId: string };
