import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, time = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, time);
    return () => clearTimeout(timer);
  }, [value, time]);

  return debouncedValue;
}
