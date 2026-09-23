import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { WsException } from "@nestjs/websockets";

@Catch()
export class AppErrorFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  private readonly logger = new Logger(AppErrorFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpStatus, message } = this.normalize(exception);
    this.logger.log("App Error", host.getType<string>())
    switch (host.getType<string>()) {
      case "http":
        this.handleHttp(host, httpStatus, message);
        break;
      case "ws":
        this.handleWs(host, httpStatus, message);
        break;
    }
  }

  private handleHttp(host: ArgumentsHost, status: number, message: string) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

      return httpAdapter.reply(
      ctx.getResponse(),
      {
        statusCode: status,
        message,
      },
      status,
    );
  }

  private handleWs(host: ArgumentsHost, status: number, message: string) {
    const client = host.switchToWs().getClient();
    client.emit("exception", { status, message });
  }

  private normalize(exception: unknown): {
    httpStatus: number;
    message: string;
  } {
    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      const message =
        typeof res === "string"
          ? res
          : ((res as any).message ?? exception.message);
      return {
        httpStatus: exception.getStatus(),
        message: Array.isArray(message) ? message.join(", ") : message,
      };
    } else if (exception instanceof WsException) {
      const err = exception.getError();
      return {
        httpStatus: HttpStatus.BAD_REQUEST,
        message:
          typeof err === "string" ? err : ((err as any).message ?? "Error"),
      };
    }

    return {
      httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Internal server error",
    };
  }
}
