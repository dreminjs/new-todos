import { create } from "zustand";

interface DraggingTodosState {
  draggingTodos: Record<string, { x: number; y: number }>;
  setDragPosition: (todoId: string, data: { x: number; y: number }) => void;
  timers: Record<string, ReturnType<typeof setTimeout>>;
  clearDrag: (todoId: string) => void;
}

export const useDraggingTodosStore = create<DraggingTodosState>((set, get) => ({
  draggingTodos: {},
  timers: {},

  setDragPosition: (todoId, data) => {
    const existingTimer = get().timers[todoId];
    if (existingTimer) clearTimeout(existingTimer);

    const timer = setTimeout(() => {
      get().clearDrag(todoId);
    }, 1200);

    set((state) => ({
      draggingTodos: { ...state.draggingTodos, [todoId]: data },
      timers: { ...state.timers, [todoId]: timer },
    }));
  },

  clearDrag: (todoId) =>
    set((state) => {
      const existingTimer = state.timers[todoId];
      if (existingTimer) clearTimeout(existingTimer);

      const { [todoId]: _, ...restDrags } = state.draggingTodos;
      const { [todoId]: __, ...restTimers } = state.timers;

      return { draggingTodos: restDrags, timers: restTimers };
    }),
}));
