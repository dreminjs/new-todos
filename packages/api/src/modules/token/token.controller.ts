import { Controller, Get, Res, UseGuards } from "@nestjs/common";
import { RefreshTokenGuard } from "./guards/refresh-token.guard.js";
import { CurrentUser } from "../user/decorators/user.decorator.js";
import { TokenService } from "./token.service.js";
import type { FastifyReply } from "fastify";
import { minutes, Throttle } from "@nestjs/throttler";
@UseGuards(RefreshTokenGuard)
@Controller("token")
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}
  @Throttle({ default: { limit: 10, ttl: minutes(5) } })
  @Get()
  async refresh(
    @CurrentUser("id") currentUserId: string,
    @CurrentUser("email") email: string,
    @Res({ passthrough: true })
    res: FastifyReply,
  ) {
    return this.tokenService.generateAuthTokens(
      { userId: currentUserId, email },
      res,
    );
  }
}
