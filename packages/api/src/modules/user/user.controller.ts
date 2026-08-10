import { Controller, Get, UseGuards } from "@nestjs/common";
import { CurrentUser } from "./decorators/user.decorator.js";
import type { TUser } from "types";
import { userSchema } from "types";
import { AccessTokenGuard } from "../token/guards/accees-token.guard.js";

@Controller("user")
export class UserController {
  @UseGuards(AccessTokenGuard)
  @Get("me")
  async findMe(@CurrentUser() user: TUser): Promise<TUser> {
    return userSchema.parse(user);
  }
}
