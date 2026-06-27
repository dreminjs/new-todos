import { useQuery } from "@tanstack/react-query";
import { findGroups } from "./service";

export const useGetTodoGroups = () => {
  return useQuery({
    queryKey: ["todo-groups"],
    queryFn: findGroups,
  });
};
