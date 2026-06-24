import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { findMe } from "./services";
import type { TUser } from "types";
export function useGetMe(): UseQueryResult<TUser>;
export function useGetMe<K extends keyof TUser>(
  keys: K,
): Omit<UseQueryResult<TUser>, "data"> & { data: TUser[K] | undefined };

export function useGetMe(keys?: keyof TUser): unknown {
  const { data, ...rest } = useQuery({
    queryKey: ["me"],
    queryFn: findMe,
  });

  return { data: keys ? data?.[keys] : data, ...rest };
}
