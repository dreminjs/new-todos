import { InjectRedis } from "@nestjs-redis/client";
import { Injectable } from "@nestjs/common";
import { Redis } from "ioredis";

@Injectable()
export class WsSessionService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async registerSocket(userId: string, socketId: string) {
    await this.redis
      .multi()
      .sadd(`user-sockets:${userId}`, socketId)
      .set(`socket:${socketId}`, userId, "EX", 60 * 60 * 24)
      .exec();
  }

  async unregisterSocket(userId: string, socketId: string) {
    await this.redis
      .multi()
      .srem(`user-sockets:${userId}`, socketId)
      .del(`socket:${socketId}`)
      .exec();
  }

  async getUserSocketIds(userId: string): Promise<string[]> {
    const socketIds = await this.redis.smembers(`user-sockets:${userId}`);
    const stale: string[] = [];
    const alive: string[] = [];

    for (const socketId of socketIds) {
      const isAlive = await this.redis.exists(`socket:${socketId}`);
      isAlive ? alive.push(socketId) : stale.push(socketId);
    }

    if (stale.length) {
      await this.redis.srem(`user-sockets:${userId}`, ...stale);
    }

    return alive;
  }
}
