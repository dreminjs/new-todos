import * as z from "zod";
import { infinityQueryParamsSchema } from "./infinity-query-params.schema.js";

export type TInfinityQueryParams = z.infer<typeof infinityQueryParamsSchema>
