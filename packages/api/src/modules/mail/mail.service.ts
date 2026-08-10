import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { TokenService } from "../token/token.service.js";

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly tokenService: TokenService,
  ) {}
  async sendConfirmationEmail(email: string, fullName: string) {
    const token = this.tokenService.generateEmailConfirmationToken(email);
    await this.mailerService.sendMail({
      to: email,
      subject: "Confirm your email",
      template: "confirmEmail",
      context: {
        token,
        fullName,
      },
    });
  }
}
