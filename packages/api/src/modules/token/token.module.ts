import { Module } from "@nestjs/common";
import { TokenService } from "./token.service.js";
import { UserModule } from "../user/user.module.js";
import { TokenController } from "./token.controller.js";
import { JwtModule } from "@nestjs/jwt";
import { PrismaModule } from "../prisma/prisma.module.js";
import { AccessTokenStrategy } from "./strategies/access-token.strategy.js";
import { RefreshTokenStrategy } from "./strategies/refresh-token.strategy.js";
import { WsAuthMiddleware } from "./ws-auth.middleware.js";

@Module({
  imports: [UserModule, JwtModule, PrismaModule],
  providers: [TokenService, AccessTokenStrategy, RefreshTokenStrategy, WsAuthMiddleware],
  controllers: [TokenController],
  exports: [TokenService, WsAuthMiddleware],
})
export class TokenModule {}
