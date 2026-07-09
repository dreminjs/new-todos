import { onlineManager } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function useIsOnline() {
  const [isOnline, setIsOnline] = useState(onlineManager.isOnline());

  useEffect(() => {
    const unsubscribe = onlineManager.subscribe((online) => {
      setIsOnline(online);
      console.log(online);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return isOnline;
}
