import { Module } from "@nestjs/common";
import { RedisService } from "./redis.service.js";
import { RedisModule as NestRedisModule } from "@nestjs-modules/ioredis";
import { ConfigModule, ConfigService } from "@nestjs/config";
@Module({
  imports: [
    NestRedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: "single",

        url: configService.get<string>("REDIS_URL"),
      }),
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
