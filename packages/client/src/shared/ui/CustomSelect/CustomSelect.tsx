import {
  createListCollection,
  Field,
  Portal,
  Select,
  Separator,
} from "@chakra-ui/react";
import clsx from "clsx";
import type { Path, UseFormRegister } from "react-hook-form";
import styles from "./CustomSelect.module.css";
import React, { Fragment } from "react";

interface ISelectProps<T> {
  name: Path<T>;
  register: UseFormRegister<T>;
  label: string;
  options: { value: string; label: string }[];
  className?: string;
  placeholder?: string;
  error?: string;
  color?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export function CustomSelect<T>({
  options,
  className,
  placeholder,
  error,
  color,
  onChange,
  label,
  value,
  disabled,
}: ISelectProps<T>) {
  const collection = createListCollection({ items: options });
  return (
    <Field.Root invalid={!!error} className={className}>
      <Field.Label fontSize="md">{label}</Field.Label>
      <Select.Root
        size="md"
        width="240"
        collection={collection}
        className={clsx(styles.select)}
        colorPalette={color}
        value={value ? [value] : []}
        onValueChange={({ value }) => {
          onChange(value[0]);
        }}
      >
        <Select.Control>
          <Select.Trigger
            borderColor="colorPalette.muted"
            bg="colorPalette.subtle"
            color="colorPalette.fg"
            disabled={disabled}
          >
            <Select.ValueText placeholder={placeholder} />
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator />
            <Select.ClearTrigger />
          </Select.IndicatorGroup>
        </Select.Control>
        <Portal>
          <Select.Positioner>
            <Select.Content className={styles.selectDropdown}>
              {options.map((data, idx) => (
                <Fragment key={data.value}>
                  <Select.Item
                    className={styles.selectDropdownItem}
                    item={data}
                  >
                    {data.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                  {idx !== options.length - 1 && <Separator size="md" />}
                </Fragment>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>
      <Field.ErrorText>{error}</Field.ErrorText>
    </Field.Root>
  );
}
