export interface IStandartResponse {
  message: string;
}

export interface IItemsResponse<T> {
  items: T[];
  nextCursor: string | null;
  hasNextPage: boolean
}
