import { Module } from "@nestjs/common";
import { WsSessionService } from "./ws-session.service.js";
import { RedisClientModule } from "../redis/redis.module.js";

@Module({
  imports: [RedisClientModule],
  providers: [WsSessionService],
  exports: [WsSessionService],
})
export class WsSessionModule {}
