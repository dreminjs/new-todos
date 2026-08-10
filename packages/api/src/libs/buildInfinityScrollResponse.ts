import { IItemsResponse } from "types";

export const buildInfinityScrollResponse = <T extends { id: string }>(
  items: T[],
  take: number,
): IItemsResponse<T> => {
  const hasNextPage = items.length > take;
  const finalItems = hasNextPage ? items.slice(0, take) : items;
  const nextCursor = hasNextPage ? finalItems[finalItems.length - 1].id : null;

  return {
    nextCursor,
    items: finalItems,
  };
};
