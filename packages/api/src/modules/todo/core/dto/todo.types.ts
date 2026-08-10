import { Prisma } from "generated/prisma/client.js";
import { EXTENDED_TODO_SELECT } from "./todo.constants.js";

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
