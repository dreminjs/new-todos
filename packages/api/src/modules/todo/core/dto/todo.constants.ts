import { Prisma } from "generated/prisma/client.js";

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
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      avatarUrl: true,
    },
  },
  assignee: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      avatarUrl: true,
    },
  },
};
