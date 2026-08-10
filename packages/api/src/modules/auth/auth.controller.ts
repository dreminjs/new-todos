import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  Param,
  Render,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service.js";
import { AuthDto, SignUpDto } from "./auth.dto.js";
import type { FastifyReply } from "fastify";
import { IStandartResponse } from "types";
import { CurrentUser } from "../user/decorators/user.decorator.js";
import { AccessTokenGuard } from "../token/guards/accees-token.guard.js";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  async login(
    @Body() authDto: AuthDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<IStandartResponse> {
    return await this.authService.login(authDto, res);
  }

  @Post("register")
  async register(
    @Body() authDto: SignUpDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<IStandartResponse> {
    return await this.authService.register(authDto, res);
  }

  @Render("thankYouForConfirmation.hbs")
  @Get("confirm-your-email/:token")
  async confirmYourEmail(
    @Res() res: FastifyReply,
    @Param("token") token: string,
  ) {
    const user = await this.authService.verifyEmailConfirmationToken(token);
    return { name: `${user.firstName}`, returnUrl: "/" };
  }

  @Get("thank-you-for-confirmation")
  thankYouForConfirmation(@Res() res: FastifyReply) {
    return res.view("thankYouForConfirmation.hbs");
  }

  @UseGuards(AccessTokenGuard)
  @Delete("logout")
  async logout(@CurrentUser("id") id: string): Promise<void> {
    await this.authService.logout(id);
  }
}
