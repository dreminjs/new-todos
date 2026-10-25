import { Prisma } from "generated/prisma/client.js";
import { PUBLIC_USER_SELECT } from "../../../../modules/user/index.js";

export const EXTENDED_TODO_SELECT: Prisma.TodoSelect = {
  id: true,
  title: true,
  description: true,
  status: true,
  priority: true,
  deadline: true,
  isMyToday: true,
  createdAt: true,
  updatedAt: true,
  workspace: true,
  todoGroup: true,
  user: {
    select: PUBLIC_USER_SELECT,
  },
  assignee: {
    select: PUBLIC_USER_SELECT,
  },
};
