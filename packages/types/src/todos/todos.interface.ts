import { z } from "zod";
import { findTodosSchema } from "./todos.schema.js";

export type TFindTodosQuery = z.infer<typeof findTodosSchema>;
