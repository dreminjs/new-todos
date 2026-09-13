import { useCallback, useRef } from "react";

type UseMessageInteractionOptions = {
  onClick?: (e: React.MouseEvent) => void;
  onLongPress?: (e: React.TouchEvent | React.MouseEvent) => void;
  longPressDelay?: number; // мс, по умолчанию 500
};

export function useMessageInteraction({
  onClick,
  onLongPress,
  longPressDelay = 500,
}: UseMessageInteractionOptions) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPressRef = useRef(false);

  const start = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if ("button" in e && e.button !== 2) return;
      console.log(e)
      isLongPressRef.current = false;
      timerRef.current = setTimeout(() => {
        isLongPressRef.current = true;
        onLongPress?.(e);
      }, longPressDelay);
    },
    [onLongPress, longPressDelay],
  );

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (isLongPressRef.current) {
        isLongPressRef.current = false;
        return;
      }
      onClick?.(e);
    },
    [onClick],
  );

  return {
    onClick: handleClick,
    onMouseDown: start,
    onMouseUp: clear,
    onMouseLeave: clear,
    onTouchStart: start,
    onTouchEnd: clear,
    onTouchMove: clear,
  };
}
