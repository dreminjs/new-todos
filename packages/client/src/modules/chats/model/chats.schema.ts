import { createChatMessageBodySchema } from "types";

import z from "zod";
import {
  MAX_FILE_SIZE,
  ACCEPTED_IMAGE_TYPES,
} from "../../../shared/model/files.constants";

const singleFileSchema = z
  .custom<File>((val) => val instanceof File, "Файл обязателен")
  .refine(
    (file) => file.size <= MAX_FILE_SIZE,
    "Максимальный размер файла — 5 МБ",
  )
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    "Неподдерживаемый формат файла",
  );

export const createChatMessageFormDtoSchema = createChatMessageBodySchema
  .omit({ replyToId: true })
  .extend({
    files: z.array(singleFileSchema),
  });
