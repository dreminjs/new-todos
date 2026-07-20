import { DatePicker, Field, Portal } from "@chakra-ui/react";
import { LuCalendar } from "react-icons/lu";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import styles from "./CustomDatePicker.module.css";
import {
  formatToLocalYYYYMMDD,
  formatToUTCYYYYMMDD,
} from "../../model/lib/date.helper";

interface IDatePickerProps {
  value: Date;
  onChange: (value: Date) => void;
  error?: string;
  label: string;
  className?: string;
}

export function CustomDatePicker({
  value,
  onChange,
  error,
  label,
  className,
}: IDatePickerProps) {
  return (
    <>
      <Field.Root invalid={!!error}>
        <DatePicker.Root
          className={className}
          min={parseDate(formatToLocalYYYYMMDD(new Date()))}
          value={value ? [parseDate(formatToUTCYYYYMMDD(value))] : []}
          onValueChange={(e) => {
            const dateValue = e.value[0];
            onChange(dateValue ? dateValue.toDate("UTC") : null);
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
              {value && (
                <DatePicker.Trigger>
                  <DatePicker.ClearTrigger />
                </DatePicker.Trigger>
              )}
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
