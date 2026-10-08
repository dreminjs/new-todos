import { Module } from "@nestjs/common";
import { MediasoupService } from "./mediasoup.service.js";
import { RoomsService } from "./rooms.service.js";
import { CallPresenceService } from "./call-presence.service.js";
import { RedisClientModule } from "../infra/redis/redis.module.js";
@Module({
  imports: [RedisClientModule],
  providers: [MediasoupService, RoomsService, CallPresenceService],
})
export class CallsModule {}
