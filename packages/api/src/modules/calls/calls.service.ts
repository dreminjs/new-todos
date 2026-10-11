import { InjectRedis } from "@nestjs-redis/client";
import { Injectable } from "@nestjs/common";
import { Redis } from "ioredis";
import { Call, IStartCall } from "./calls.interfaces.js";

@Injectable()
export class CallsService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async startCall(dto: IStartCall) {
    await this.redis
      .multi()
      .hset(`call:${dto.callId}`, new Call(dto))
      .set(`chat-active-call:${dto.chatId}`, dto.callId)
      .exec();
  }

  async addParticipant(callId: string, userId: string) {
    await this.redis.sadd(`call:${callId}:participants`, userId);
  }

  async removeParticipant(callId: string, userId: string): Promise<number> {
    await this.redis.srem(`call:${callId}:participants`, userId);
    const count = await this.redis.scard(`call:${callId}:participants`);

    if (count === 0) {
      await this.endCall(callId);
    }

    return count;
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
      this.redis.hgetall(`call:${callId}`) as unknown as Promise<Call>,
      this.redis.smembers(`call:${callId}:participants`) as unknown as string[],
    ]);

    if (!call.status) return null;
    return { ...call, participants };
  }
}
