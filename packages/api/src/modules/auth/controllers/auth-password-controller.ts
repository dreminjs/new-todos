import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AccessTokenGuard } from "../../token/guards/accees-token.guard.js";
import { CurrentUser } from "../../user/decorators/user.decorator.js";
import {
  changePasswordSchema,
  type IRequestChangePasswordResult,
  type IStandartResponse,
  requestChangePasswordSchema,
  type TChangePassword,
  type TRequestChangePassword,
} from "types";
import { AuthService } from "../auth.service.js";

@Controller("auth/password")
export class AuthPasswordController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AccessTokenGuard)
  @Post("request/change")
  async requestChangePassword(
    @CurrentUser("id") userId: string,
    @Body({ schema: requestChangePasswordSchema }) dto: TRequestChangePassword,
  ): Promise<IRequestChangePasswordResult> {
    return this.authService.requestChangePassword(userId, dto.password);
  }

  @UseGuards(AccessTokenGuard)
  @Post("change")
  async changePassword(
    @CurrentUser("id") userId: string,
    @Body({ schema: changePasswordSchema }) dto: TChangePassword,
  ): Promise<IStandartResponse> {
    return this.authService.changePassword(userId, dto);
  }
}
