import {
  Controller,
  FileTypeValidator,
  Get,
  Logger,
  MaxFileSizeValidator,
  ParseFilePipe,
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

  private logger = new Logger(UserController.name);

  @Get("me")
  async findMe(@CurrentUser() user: TUser): Promise<TUser> {
    return userSchema.parse(user);
  }

  @UseInterceptors(FileInterceptor("avatar"))
  @Get("upload-avatar")
  async uploadAvatar(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000 }),
          new FileTypeValidator({ fileType: "image/png" }),
          new FileTypeValidator({ fileType: "image/jpg" }),
        ],
      }),
    )
    avatar: UploadedMultipartFile,
    @CurrentUser("id") currentUserId: string,
  ) {
    return this.userService.uploadUserAvatar(currentUserId, avatar);
  }
}
