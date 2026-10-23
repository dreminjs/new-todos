import { UploadedMultipartFile } from "@nestjs/platform-fastify";
import { IUploadedFile } from "src/interfaces/multipart.js";

export async function normalizeFiles(
  files: Array<UploadedMultipartFile>,
): Promise<IUploadedFile[]> {
  return Promise.all(
    files.map(async (file) => {
      const buffer = (file as any).buffer ?? (await (file as any).toBuffer?.());
      return {
        fieldname: file.fieldname,
        filename: file.filename || (file as any).originalname,
        mimetype: file.mimetype,
        buffer,
        size: (file as any).size ?? buffer.length,
      };
    }),
  );
}
