import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { IUploadedFile } from "../interfaces/multipart.js";

export const UploadedFiles = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): IUploadedFile[] => {
    const request = ctx.switchToHttp().getRequest();
    return request.uploadedFiles ?? [];
  },
);
