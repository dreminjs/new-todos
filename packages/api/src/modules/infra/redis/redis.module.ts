import { Module } from "@nestjs/common";
import { RedisModule as NestRedisModule } from "@nestjs-redis/client";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RedisService } from "./redis.service.js";

export const RedisClientModule = NestRedisModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: "client",
    options: {
      url: configService.get<string>("REDIS_URL"),
    },
  }),
});
@Module({
  imports: [
    RedisClientModule,
  ],
  providers: [RedisService],
  exports: [RedisService, RedisClientModule],
})
export class RedisModule {}
