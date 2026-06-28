import { useState } from "react";
import type { TTodo } from "types";

interface IUseTodos {}

export const useTodos = (dto: IUseTodos) => {
  const [pendingTodos, setPendingTodos] = useState([]);
  const [inProgresTodos, setInProgressTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);
  const [archivedTodos, setArchivedTodos] = useState([]);

  const handleAddPendingTodo = (dto: TTodo) => {
    setPendingTodos((prev) => [...prev, dto]);
  };

  const handleAddInProgressTodo = (dto: TTodo) => {
    setInProgressTodos((prev) => [...prev, dto]);
  };

  const handleAddCompletedTodo = (dto: TTodo) => {
    setCompletedTodos((prev) => [...prev, dto]);
  };

  const handleAddArchivedTodo = (dto: TTodo) => {
    setArchivedTodos((prev) => [...prev, dto]);
  };

  return {
    pendingTodos,
    inProgresTodos,
    completedTodos,
    archivedTodos,
    handleAddPendingTodo,
    handleAddInProgressTodo,
    handleAddCompletedTodo,
    handleAddArchivedTodo,
  };
};
