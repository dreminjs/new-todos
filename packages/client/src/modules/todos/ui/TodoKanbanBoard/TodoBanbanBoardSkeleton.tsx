import type { FC } from "react";
import { TodoKanbanHeader } from "./TodoKanbanHeader";
import { Skeleton } from "@chakra-ui/react";
import styles from "./TodoKanbanBoard.module.css";

interface ITodoKanbanBoardSkeletonProps {
  title: string;
}

export const TodoKanbanBoardSkeleton: FC<ITodoKanbanBoardSkeletonProps> = ({
  title,
}) => {
  return (
    <div className={styles.TodoKanbanBoardColumn}>
      <TodoKanbanHeader title={title} isPostDisabled={true} />
      <Skeleton flex={"1"} width={"100%"} />
    </div>
  );
};
