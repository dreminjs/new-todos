import { FormContainer } from "../../../../../shared";
import type { FC } from "react";
import { RequestPasswordForm } from "./RequestPasswordForm";
import { useChangePassword } from "../../../model/hooks/useChangePassword";
import { ConfirmPasswordChanging } from "./ConfirmPasswordChanging";
import { FormHeader } from "../../../../../shared/ui/FormHeader/FormHeader";

export const ChangePassword: FC = () => {
  const {
    postRequestChangePassword,
    postChangePassword,
    postChangePasswordIsLoading,
    postRequestChangePasswordIsLoading,
    step,
  } = useChangePassword();

  return (
    <>
      <FormContainer
        header={
          <>
            <FormHeader
              title={
                step === "request"
                  ? "Enter your old password"
                  : "Enter new password"
              }
              subtitle="Make sure that your password is enough complicated"
            />
          </>
        }
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
