import { forwardRef, Module } from "@nestjs/common";
import { UserService } from "./user.service.js";
import { PrismaModule } from "../prisma/prisma.module.js";
import { UserController } from "./user.controller.js";
import { TokenModule } from "../token/token.module.js";

@Module({
  imports: [PrismaModule, forwardRef(() => TokenModule)],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
