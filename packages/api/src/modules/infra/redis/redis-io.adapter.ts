import { IoAdapter } from "@nestjs/platform-socket.io";
import { ServerOptions } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;

  async connectToRedis(): Promise<void> {
    const pubClient = createClient({
      url: process.env.REDIS_URL ?? "redis://localhost:6379",
    });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);
    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const raw = process.env.CORS_ALLOWED_ORIGINS;
    const allowedOrigins = raw
      ? raw.split(",").map((o) => o.trim())
      : ["http://localhost:5173"];

    const optionsWithCORS = {
      ...options,
      cors: {
        origin: allowedOrigins,
        credentials: true,
      },
    };

    const server = super.createIOServer(port, optionsWithCORS);
    server.adapter(this.adapterConstructor);
    return server;
  }
}
