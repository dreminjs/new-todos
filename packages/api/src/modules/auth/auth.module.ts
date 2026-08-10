import { Module } from '@nestjs/common';
import { AuthController } from '../auth/auth.controller.js';
import { AuthService } from '../auth/auth.service.js';
import { UserModule } from '../user/user.module.js';
import { TokenModule } from '../token/token.module.js';
import { MailModule } from '../mail/mail.module.js';

@Module({
  imports: [UserModule, TokenModule, MailModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
