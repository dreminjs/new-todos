import type z from "zod";
import type { changeAvatarProfileBodyDtoSchema } from "./users.schema";



export type TChangeAvatarProfileBodyDtoSchema = z.infer<typeof changeAvatarProfileBodyDtoSchema>
