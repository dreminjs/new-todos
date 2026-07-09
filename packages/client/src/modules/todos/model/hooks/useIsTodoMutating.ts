import { useIsMutating } from "@tanstack/react-query";


export const useIsTodoMutating = ({
  todoId,
  todoGroupId,
}: {
  todoId: string;
  todoGroupId: string;
  }): boolean => {
  const isCreatingLoading = useIsMutating({ mutationKey: ["todo", "create"] }) > 0;
  const isUpdatingLoading = useIsMutating({ mutationKey: ["todo", "update", todoId] }) > 0;
  const isDeleteLoading = useIsMutating({ mutationKey: ["todo", "delete"] }) > 0;
  const isUpdateStatusLoading = useIsMutating({ mutationKey: ["todo", "update", "status"] }) > 0;
  const isUpdatingGroupTodo = useIsMutating({ mutationKey: ["todo-groups", todoGroupId] }) > 0;
  return (
    isCreatingLoading ||
    isUpdatingLoading ||
    isDeleteLoading ||
    isUpdateStatusLoading ||
    isUpdatingGroupTodo
  );
};
