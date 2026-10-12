import { Module } from "@nestjs/common";
import { MediasoupService } from "./mediasoup.service.js";
import { RoomsService } from "./rooms.service.js";
import { CallsService } from "./calls.service.js";
import { RedisClientModule } from "../infra/redis/redis.module.js";
import { TokenModule } from "../token/token.module.js";
import { CallsGateway } from './calls.gateway.js';
import { UserModule } from "../user/user.module.js";
@Module({
  imports: [RedisClientModule, TokenModule, UserModule],
  providers: [MediasoupService, RoomsService, CallsService, CallsGateway],
  exports: [CallsService],
})
export class CallsModule { }
