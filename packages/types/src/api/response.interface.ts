export interface IStandartResponse {
  message: string;
}

export interface IItemsResponse<T> {
  items: T[];
  total: number;
  nextCursor: string | null;
}
