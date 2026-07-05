import { Checkbox, type ConditionalValue } from "@chakra-ui/react";
import clsx from "clsx";
import type { FC } from "react";

interface ICustomCheckboxProps {
  className?: string;
  variant?: ConditionalValue<"outline" | "solid" | "subtle">;
  title: string;
  onChange: (checked: boolean) => void;
  value: boolean;
}

export const CustomCheckbox: FC<ICustomCheckboxProps> = ({
  className,
  variant,
  title,
  onChange,
  value,
}) => {
  return (
    <Checkbox.Root
      onCheckedChange={(e) => onChange(Boolean(e.checked))}
      checked={value}
      className={clsx(className)}
      variant={variant}
    >
      <Checkbox.HiddenInput />
      <Checkbox.Control>
        <Checkbox.Indicator />
      </Checkbox.Control>
      <Checkbox.Label fontSize={"md"}>{title}</Checkbox.Label>
    </Checkbox.Root>
  );
};
