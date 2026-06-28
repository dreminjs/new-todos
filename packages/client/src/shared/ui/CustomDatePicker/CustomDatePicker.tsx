import { DatePicker, Field, Portal } from "@chakra-ui/react";
import { LuCalendar } from "react-icons/lu";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import styles from "./CustomDatePicker.module.css";

interface IDatePickerProps {
  value: Date;
  onChange: (value: Date) => void;
  error?: string;
  label: string;
}

export function CustomDatePicker({
  value,
  onChange,
  error,
  label,
}: IDatePickerProps) {
  return (
    <>
      <Field.Root invalid={!!error}>
        <DatePicker.Root
          value={value ? [parseDate(value.toISOString().split("T")[0])] : []}
          onValueChange={(e) => {
            const dateValue = e.value[0];
            onChange(dateValue ? dateValue.toDate(getLocalTimeZone()) : null);
          }}
          invalid={!!error}
        >
          <DatePicker.Label>{label}</DatePicker.Label>
          <DatePicker.Control>
            <DatePicker.Input
              className={styles.datePicker}
              placeholder="Select date"
            />
            <DatePicker.IndicatorGroup>
              <DatePicker.Trigger>
                <LuCalendar />
              </DatePicker.Trigger>
            </DatePicker.IndicatorGroup>
          </DatePicker.Control>
          <Portal>
            <DatePicker.Positioner>
              <DatePicker.Content className={styles.datePicker}>
                <DatePicker.View view="day">
                  <DatePicker.Header />
                  <DatePicker.DayTable />
                </DatePicker.View>
                <DatePicker.View view="month">
                  <DatePicker.Header />
                  <DatePicker.MonthTable />
                </DatePicker.View>
                <DatePicker.View view="year">
                  <DatePicker.Header />
                  <DatePicker.YearTable />
                </DatePicker.View>
              </DatePicker.Content>
            </DatePicker.Positioner>
          </Portal>
        </DatePicker.Root>
        <Field.ErrorText>{error}</Field.ErrorText>
      </Field.Root>
    </>
  );
}
