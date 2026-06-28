import { Field, Input, Textarea } from "@chakra-ui/react";
import styles from "./FormField.module.css";
import type { Path, UseFormRegister } from "react-hook-form";
import clsx from "clsx";

interface IFormFieldProps<T> {
  name: Path<T>;
  register: UseFormRegister<T>;
  error: string;
  label: string;
  isTextarea?: boolean;
  className?: string;
}

export function FormField<T>(props: IFormFieldProps<T>) {
  return (
    <Field.Root invalid={!!props.error} className={props.className}>
      <Field.Label fontSize={"md"}>{props.label}</Field.Label>
      {props.isTextarea ? (
        <Textarea
          className={styles.formFieldInput}
          {...props.register(props.name)}
        />
      ) : (
        <Input
          className={styles.formFieldInput}
          {...props.register(props.name)}
        />
      )}
      <Field.ErrorText>{props.error}</Field.ErrorText>
    </Field.Root>
  );
}
