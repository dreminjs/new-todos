import { useMutation } from "@tanstack/react-query";
import { signin, signup } from "./services";
import { useSystemNotificationStore } from "../../system-notifications/model/notification.store";
import { useNavigate } from "react-router";
import type { AxiosError } from "axios";
import type { IStandartResponse } from "types";

export const useSignup = () => {
  const addNotification = useSystemNotificationStore(
    (state) => state.addNotification,
  );

  const navigate = useNavigate();

  return useMutation({
    mutationFn: signup,
    onSuccess: () => {
      addNotification({
        message: "User registered successfully",
        type: "success",
      });
      setTimeout(() => {
        navigate("/");
      }, 1500);
    },
    onError: (data: AxiosError<IStandartResponse>) => {
      addNotification({
        message: data.response.data.message,
        type: "error",
      });
    },
  });
};

export const useSignin = () => {
  const addNotification = useSystemNotificationStore(
    (state) => state.addNotification,
  );

  const navigate = useNavigate();

  return useMutation({
    mutationFn: signin,
    onSuccess: () => {
      addNotification({
        message: "User signed in successfully",
        type: "success",
      });
      setTimeout(() => {
        navigate("/");
      }, 1500);
    },
    onError: (data: AxiosError<IStandartResponse>) => {
      addNotification({
        message: data.response.data.message,
        type: "error",
      });
    },
  });
};
