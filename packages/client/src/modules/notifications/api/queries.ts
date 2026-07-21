
import { useQuery } from "@tanstack/react-query";
import { findMyNotifications } from "./services";

export const useGetMyNotifications = () => {
  return useQuery({
    queryKey: ["notifications", "my"],
    queryFn: findMyNotifications,
  });
}
