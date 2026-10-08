import { Module } from "@nestjs/common";
import { seconds, ThrottlerModule } from "@nestjs/throttler";
import { RedisToken } from "@nestjs-redis/client";
import { RedisThrottlerStorage } from "@nestjs-redis/throttler-storage";
import { RedisModule } from "@nestjs-redis/client";
import { RedisClientModule } from "../redis/redis.module.js";
@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [RedisModule, RedisClientModule],
      inject: [RedisToken()],
      useFactory: (redis) => ({
        throttlers: [{ limit: 10, ttl: seconds(60) }],
        storage: new RedisThrottlerStorage(redis),
      }),
    }),
  ],
})
export class ThrottlerRedisModule {}
