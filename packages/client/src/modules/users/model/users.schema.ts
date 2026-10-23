import z from "zod";
import {
  MAX_FILE_SIZE,
  ACCEPTED_IMAGE_TYPES,
} from "../../../shared/model/files.constants";

export const changeAvatarProfileBodyDtoSchema = z.object({
  avatar: z
    .custom<File>((file) => file instanceof File, "File is required")
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      "Максимальный размер файла — 5 МБ",
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Неподдерживаемый формат файла",
    ),
});
