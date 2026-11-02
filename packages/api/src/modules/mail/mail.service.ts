import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { TokenService } from "../token/token.service.js";
import { IChangePasswordDto } from "../token/dto/token.dto.js";

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

  async sendChangePasswordEmail(dto: IChangePasswordDto, fullName: string) {
    const token = this.tokenService.generateChangePasswordToken(dto);
    await this.mailerService.sendMail({
      to: dto.email,
      subject: "Change your email",
      template: "changeYourPassword",
      context: {
        token,
        fullName,
      },
    });
  }
}
