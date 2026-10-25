import type { FC } from "react";
import { FormBottom, FormContainer, useDebounce } from "../../../../../shared";
import { useGetUsernameAvailability, useUpdateMe } from "../../../../users";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usernameQueryParamsSchema, type TUsernameQueryParams } from "types";
import { UsernameField } from "./UsernameField";
import { Skeleton } from "@chakra-ui/react";
import styles from "./UsernameForm.module.css";
interface IUsernameFormProps {
  username: string;
}

export const UsernameForm: FC<IUsernameFormProps> = (props) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TUsernameQueryParams>({
    resolver: zodResolver(usernameQueryParamsSchema),
    defaultValues: {
      username: props.username,
    },
  });

  const username = useWatch<TUsernameQueryParams>({
    control,
    name: "username",
  });

  const debouncedUsername = useDebounce(username);

  const { data, isLoading: usernameAvailabilityIsLoading } =
    useGetUsernameAvailability({
      username: debouncedUsername,
    });

  const { mutate, isPending: updatingMeIsPending } = useUpdateMe();

  const onSubmit = (dto: TUsernameQueryParams) => {
    mutate(dto);
  };

  if (usernameAvailabilityIsLoading || !data) {
    return <Skeleton height={300} width={520} />;
  }

  return (
    <>
      <FormContainer
        title="Public Username"
        subtitle="People can use it for mentioning you in conversations"
      >
        <form onSubmit={handleSubmit(onSubmit)} className={styles.usernameForm}>
          <UsernameField
            register={register}
            error={errors.username?.message || ""}
            available={data.availabel}
            showIndecator={debouncedUsername != props.username}
          />
          <FormBottom
            disabled={!data.availabel || updatingMeIsPending}
            isLoading={usernameAvailabilityIsLoading}
          />
        </form>
      </FormContainer>
    </>
  );
};
