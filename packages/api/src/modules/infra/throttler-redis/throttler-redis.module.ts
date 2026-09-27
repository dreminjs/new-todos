import { Module } from "@nestjs/common";
import { ThrottlerModule } from "@nestjs/throttler";
import { ThrottlerStorageRedisService } from "@nest-lab/throttler-storage-redis";
import { Redis } from "ioredis";
@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      useFactory: () => ({
        throttlers: [
          {
            name: "default",
            ttl: 60000,
            limit: process.env.NODE_ENV === "test" ? 10000 : 100,
          },
        ],
        storage: new ThrottlerStorageRedisService(
          new Redis(process.env.REDIS_URL!),
        ),
      }),
    }),
  ],
})
export class ThrottlerRedisModule {}
