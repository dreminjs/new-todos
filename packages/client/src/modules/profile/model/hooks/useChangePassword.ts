import { useEffect, useState } from "react";
import {
  usePostChangePassword,
  usePostRequestChangePassword,
} from "../../../auth/api/queries";
import type { TChangePassword, TRequestChangePassword } from "types";

type TStep = "request" | "change";

export const useChangePassword = () => {
  const [step, setStep] = useState<TStep>("request");

  const {
    data: requestChangePasswordResult,
    mutate: postRequestChangePassword,
    isPending: postRequestChangePasswordIsLoading,
  } = usePostRequestChangePassword({
    onSuccess: () => setStep("change"),
  });

  const {
    data: changePasswordResult,
    mutate: postChangePassword,
    isPending: postChangePasswordIsLoading,
  } = usePostChangePassword({
    onSuccess: () => setStep("request"),
  });

  const handleRequestChangingPassword = (dto: TRequestChangePassword) => {
    postRequestChangePassword(dto);
  };

  const handleChangePassword = (dto: TChangePassword) => {
    postChangePassword({ ...dto, token: requestChangePasswordResult.token });
  };

  return {
    requestChangePasswordResult,
    postRequestChangePassword: handleRequestChangingPassword,
    postRequestChangePasswordIsLoading,
    step,
    data: changePasswordResult,
    postChangePassword: handleChangePassword,
    postChangePasswordIsLoading,
  };
};
