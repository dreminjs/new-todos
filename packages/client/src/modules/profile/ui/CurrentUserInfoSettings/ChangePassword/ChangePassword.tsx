import { FormContainer } from "../../../../../shared";
import type { FC } from "react";
import { RequestPasswordForm } from "./RequestPasswordForm";
import { useChangePassword } from "../../../model/hooks/useChangePassword";
import { ConfirmPasswordChanging } from "./ConfirmPasswordChanging";
import type { TChangePasswordForm } from "../../../model/change-password.types";

export const ChangePassword: FC = () => {
  const {
    postRequestChangePassword,
    postChangePassword,
    postChangePasswordIsLoading,
    postRequestChangePasswordIsLoading,
    step,
  } = useChangePassword();

  console.log(step);

  return (
    <>
      <FormContainer
        title={
          step === "request" ? "Enter your old password" : "enter new password"
        }
        subtitle=""
      >
        {step === "request" && (
          <>
            <RequestPasswordForm
              isLoading={postRequestChangePasswordIsLoading}
              onMutate={postRequestChangePassword}
            />
          </>
        )}
        {step === "change" && (
          <>
            <ConfirmPasswordChanging
              isLoading={postChangePasswordIsLoading}
              onMutate={postChangePassword}
            />
          </>
        )}
      </FormContainer>
    </>
  );
};
