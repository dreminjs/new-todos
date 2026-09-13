import { useEffect, useLayoutEffect, useRef, useCallback } from "react";

const NEAR_BOTTOM_THRESHOLD = 150;

type UseChatScrollBehaviorParams = {
  itemsCount: number;
};

export function useChatScrollBehavior({
  itemsCount,
}: UseChatScrollBehaviorParams) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const isPaginatingRef = useRef(false);
  const prevScrollHeightRef = useRef(0);
  const isNearBottomRef = useRef(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const distanceFromBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;
      isNearBottomRef.current = distanceFromBottom < NEAR_BOTTOM_THRESHOLD;
    };

    handleScroll();
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const markPaginationStart = useCallback(() => {
    isPaginatingRef.current = true;
    if (containerRef.current) {
      prevScrollHeightRef.current = containerRef.current.scrollHeight;
    }
  }, []);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (isPaginatingRef.current) {
      const diff = container.scrollHeight - prevScrollHeightRef.current;
      container.scrollTop += diff;
      isPaginatingRef.current = false;
      return;
    }

    if (isNearBottomRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [itemsCount]);

  return {
    containerRef,
    bottomRef,
    markPaginationStart,
    isFetchingNextPageAllowed: () => !isPaginatingRef.current,
  };
}
