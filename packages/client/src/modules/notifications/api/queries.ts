
import { useMutation, useQuery } from "@tanstack/react-query";
import { findMyNotifications, updateReadNotification } from "./services";

export const useGetMyNotifications = () => {
  return useQuery({
    queryKey: ["notifications", "my"],
    queryFn: findMyNotifications,
  });
}

// export const useUpdateReadNotification = () => {
//   const { } = useMutation({
//     mutationFn: updateReadNotification,
//     onSuccess:
//   })
// }
