import { InjectRedis } from "@nestjs-redis/client";
import { Injectable } from "@nestjs/common";
import { Redis } from "ioredis";
import { IStartCall } from "./calls.interfaces.js";

@Injectable()
export class CallPresenceService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async startCall(dto: IStartCall) {
    await this.redis
      .multi()
      .hset(`call:${dto.callId}`, {
        status: "active",
        chatId: dto.chatId,
        workspaceId: dto.workspaceId,
        initiatorId: dto.initiatorId,
        startedAt: Date.now().toString(),
      })
      .set(`chat-active-call:${dto.chatId}`, dto.callId)
      .exec();
  }

  async addParticipant(callId: string, userId: string) {
    await this.redis.sadd(`call:${callId}:participants`, userId);
  }

  async removeParticipant(callId: string, userId: string) {
    await this.redis.srem(`call:${callId}:participants`, userId);
    const count = await this.redis.scard(`call:${callId}:participants`);

    if (count === 0) {
      await this.endCall(callId);
    }
  }

  async endCall(callId: string) {
    const chatId = await this.redis.hget(`call:${callId}`, "chatId");

    await this.redis
      .multi()
      .del(`call:${callId}`)
      .del(`call:${callId}:participants`)
      .del(`chat-active-call:${chatId}`)
      .exec();
  }

  async getActiveCallForChat(chatId: string): Promise<string | null> {
    return this.redis.get(`chat-active-call:${chatId}`);
  }

  async getCallInfo(callId: string) {
    const [call, participants] = await Promise.all([
      this.redis.hgetall(`call:${callId}`),
      this.redis.smembers(`call:${callId}:participants`),
    ]);

    if (!call.status) return null;
    return { ...call, participants };
  }
}
