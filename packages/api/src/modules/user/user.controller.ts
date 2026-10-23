import {
  Controller,
  FileTypeValidator,
  Get,
  Logger,
  MaxFileSizeValidator,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { CurrentUser } from "./decorators/user.decorator.js";
import type { TUser } from "types";
import { userSchema } from "types";
import { AccessTokenGuard } from "../token/guards/accees-token.guard.js";
import {
  FileInterceptor,
  type UploadedMultipartFile,
} from "@nestjs/platform-fastify/multipart";
import { UserService } from "./user.service.js";
@UseGuards(AccessTokenGuard)
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("me")
  async findMe(@CurrentUser() user: TUser): Promise<TUser> {
    return userSchema.parse(user);
  }

  @UseInterceptors(FileInterceptor("avatar"))
  @Post("upload-avatar")
  async uploadAvatar(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 10000000 })],
      }),
    )
    avatar: UploadedMultipartFile,
    @CurrentUser("id") currentUserId: string,
  ): Promise<TUser> {
    return this.userService.uploadUserAvatar(currentUserId, avatar);
  }

  @Patch("remove-avatar")
  async removeAvatar(@CurrentUser("id") currentUserId: string): Promise<TUser> {
    return await this.userService.removeAvatar(currentUserId);
  }
}
