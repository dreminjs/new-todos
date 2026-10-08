import { createChatMessageBodySchema } from "types";

import z from "zod";
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

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
