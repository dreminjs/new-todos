import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from "@nestjs/common";
import { ZodError } from "zod";
import type { FastifyReply } from "fastify";

@Catch(ZodError)
export class ZodExceptionFilter implements ExceptionFilter {
  catch(exception: ZodError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const reply = ctx.getResponse<FastifyReply>();

    const errors = exception.issues.map((err) => ({
      path: err.path.join("."),
      message: err.message,
    }));

    reply.code(HttpStatus.BAD_REQUEST).send({
      statusCode: HttpStatus.BAD_REQUEST,
      message: "Schema validation failed",
      errors: errors,
    });
  }
}
