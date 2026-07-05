import { LuTrash } from "react-icons/lu";
import { useDeleteTodoGroup } from "../../../todo-groups";
import type { FC } from "react";
import { useNavigate } from "react-router";

interface IDeleteTodoGroupButtonProps {
  todoGroupId: string;
}

export const DeleteTodoGroupButton: FC<IDeleteTodoGroupButtonProps> = ({
  todoGroupId,
}) => {
  const { mutate } = useDeleteTodoGroup();

  const navigate = useNavigate();

  const handleDelete = () => {
    mutate(todoGroupId, {
      onSuccess: () => {
        navigate("/home");
      },
    });
  };

  return (
    <button onClick={handleDelete}>
      <LuTrash />
    </button>
  );
};
