import {
  useMutation,
  type DefaultError,
  type UseMutationOptions,
} from "@tanstack/react-query";
import {
  changePassword,
  logout,
  requestChangePassword,
  signin,
  signup,
} from "./services";
import { useSystemNotificationStore } from "../../system-notifications/model/notification.store";
import { useNavigate } from "react-router";
import type { AxiosError } from "axios";
import type {
  IRequestChangePasswordResult,
  IStandartResponse,
  TChangePassword,
  TRequestChangePassword,
} from "types";

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

export const useLogout = () => {
  const addNotification = useSystemNotificationStore(
    (state) => state.addNotification,
  );

  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => logout(),
    onMutate: () => {
      addNotification({
        type: "info",
        message: "Loading...",
      });
    },
    onSuccess: () => {
      setTimeout(() => {
        navigate("/auth/signin");
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

export const usePostRequestChangePassword = (
  params: UseMutationOptions<
    IRequestChangePasswordResult,
    DefaultError,
    TRequestChangePassword
  >,
) => {
  const addNotification = useSystemNotificationStore(
    (state) => state.addNotification,
  );

  return useMutation({
    ...params,
    mutationFn: requestChangePassword,
    onSuccess: (...args) => {
      addNotification({
        type: "info",
        message: "Successful sending request...f",
      });
      params.onSuccess(...args);
    },
    onError: (...args) => {
      addNotification({ type: "error", message: "Smth went wrong..." });
      params.onError(...args);
    },
  });
};
export const usePostChangePassword = (
  params: UseMutationOptions<IStandartResponse, DefaultError, TChangePassword>,
) => {
  const addNotification = useSystemNotificationStore(
    (state) => state.addNotification,
  );

  return useMutation({
    ...params,
    mutationFn: changePassword,
    onSuccess: (...args) => {
      addNotification({
        type: "success",
        message: "Successful changing password",
      });
      params.onSuccess(...args);
    },

    onError: (...args) => {
      addNotification({ type: "error", message: "Smth went wrong..." });
      params.onError(...args);
    },
  });
};
