import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { UserService } from "../user/user.service.js";
import type { User } from "generated/prisma/client.js";
import { TokenService } from "../token/token.service.js";
import { hashPassword, comparePasswords } from "./helpers/hash.js";
import { MailService } from "../mail/mail.service.js";
import { FastifyReply } from "fastify";
import {
  AuthDto,
  IStandartResponse,
  SignUpDto,
  TChangePassword,
  TForgotPasswordDto,
  TVerifyCodeDto,
  type IRequestChangePasswordResult,
} from "types";
import { NotFoundError } from "../../classes/app.error.js";
import { validatePassword } from "./helpers/comparePasswords.js";
import { generateSixDigitsCode } from "./helpers/generate-6-digits-code.js";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService,
  ) {}

  async loginValidate({
    email,
    isUserRequired,
  }: {
    email: string;
    isUserRequired: boolean;
  }): Promise<User | null> {
    const candidate = await this.userService.findOne({ where: { email } });
    if (isUserRequired && !candidate) {
      throw new NotFoundError("User not found");
    } else if (!isUserRequired && candidate) {
      throw new NotFoundError("User already exists");
    }

    return candidate;
  }

  async login(dto: AuthDto, res: FastifyReply): Promise<IStandartResponse> {
    const user = await this.loginValidate({
      email: dto.email,
      isUserRequired: true,
    });

    await validatePassword(dto.password, user!.hashedPassword);

    return await this.tokenService.generateAuthTokens(
      {
        email: user!.email,
        userId: user!.id,
      },
      res,
    );
  }

  async register(
    dto: SignUpDto,
    res: FastifyReply,
  ): Promise<IStandartResponse> {
    await this.loginValidate({ email: dto.email, isUserRequired: false });
    const hashedPassword = await hashPassword(dto.password);
    const newUser = await this.userService.createOne({
      data: {
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        hashedPassword,
        username: dto.username,
      },
    });

    this.mailService
      .sendConfirmationEmail(
        dto.email,
        `${dto.firstName} ${dto.lastName.charAt(0)}`,
      )
      .catch((err) => {
        console.error(err);
      });
    return await this.tokenService.generateAuthTokens(
      {
        email: dto.email,
        userId: newUser.id,
      },
      res,
    );
  }

  async verifyEmailConfirmationToken(token: string): Promise<User> {
    const email = this.tokenService.verifyEmailConfirmationToken(token).email;
    return await this.userService.confirmEmail(email);
  }

  async logout(userId: string, res: FastifyReply): Promise<void> {
    await this.tokenService.logout(userId, res);
  }

  async forgotPassword(dto: TForgotPasswordDto): Promise<IStandartResponse> {
    const code = generateSixDigitsCode();

    await this.mailService.sendForgotPasswordEmail(dto.email, code);
    return {
      message: "ok",
    };
  }

  async requestChangePassword(
    userId: string,
    oldPassword: string,
  ): Promise<IRequestChangePasswordResult> {
    const user = await this.userService.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundError("No user found.");
    }

    await validatePassword(oldPassword, user.hashedPassword);

    const token = await this.tokenService.generateChangePasswordToken({
      email: user.email,
      userId: user.id,
    });

    return {
      token,
    };
  }

  async changePassword(
    userId: string,
    dto: TChangePassword,
  ): Promise<IStandartResponse> {
    const user = await this.userService.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError("No user found");
    }

    await this.tokenService.verifyChangePasswordToken(dto.token);

    const hashedPassword = await hashPassword(dto.password);

    await this.userService.updateOne({
      where: { id: userId },
      data: { hashedPassword },
    });

    return {
      message: "Password is changed",
    };
  }

  async verifyPasswordCode(dto: TVerifyCodeDto) {
    const user = await this.userService.findOne({
      where: {
        userForgotPasswordCode: {
          code: dto.code,
        },
      },
    });

    if (!user) {
      throw new NotFoundError("no user");
    }

    const token = this.tokenService.generateForgotPasswordToken({
      email: user.email,
    });
  }
}
