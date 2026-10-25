import { useForm } from "react-hook-form";
import { useUpdateMe } from "../../../../users";
import styles from "./FullnameForm.module.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserDtoSchema, type TUpdateUserDto, type TUser } from "types";
import { FormBottom, FormContainer, FormField } from "../../../../../shared";
import type { FC } from "react";

type TFullnameForm = Pick<TUser, "firstName" | "lastName">;

export const FullnameForm: FC<TFullnameForm> = ({ firstName, lastName }) => {
  const { mutate, isPending } = useUpdateMe();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateUserDtoSchema),
    defaultValues: {
      firstName,
      lastName,
    },
  });

  const onSubmit = (dto: TUpdateUserDto) => {
    mutate(dto);
  };

  return (
    <FormContainer
      title="Display Fullname"
      subtitle="This name will appear on official invoices, workspace member lists, and team mentions"
    >
      <form onSubmit={handleSubmit(onSubmit)} className={styles.fullnameForm}>
        <div className={styles.fullnameFormInner}>
          <FormField<TUpdateUserDto>
            register={register}
            error={errors.firstName?.message || ""}
            name={"firstName"}
            label="first name"
          />
          <FormField<TUpdateUserDto>
            register={register}
            error={errors.lastName?.message || ""}
            name={"lastName"}
            label="last name"
          />
        </div>
        <FormBottom isLoading={isPending} />
      </form>
    </FormContainer>
  );
};
