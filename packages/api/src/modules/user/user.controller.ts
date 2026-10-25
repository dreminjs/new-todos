import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  Logger,
  MaxFileSizeValidator,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { CurrentUser } from "./decorators/user.decorator.js";
import type { TCheckUsernameAvailableResult, TUpdateUserDto, TUser, TUsernameQueryParams } from "types";
import {
  updateUserDtoSchema,
  usernameQueryParamsSchema,
  userSchema,
} from "types";
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

  @Patch("me")
  async updateMe(
    @Body({ schema: updateUserDtoSchema }) dto: TUpdateUserDto,
    @CurrentUser("id") userId: string,
  ) {
    return await this.userService.updateOne({
      where: { id: userId },
      data: {
        ...dto,
      },
    });
  }

  @Get("username-available")
  async checkUsername(
    @Query({ schema: usernameQueryParamsSchema }) dto: TUsernameQueryParams,
  ): Promise<TCheckUsernameAvailableResult> {
    return await this.userService.checkUsername(dto);
  }
}
