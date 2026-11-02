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
  TChangePasswordResult,
} from "types";
import { BadRequestError, NotFoundError } from "../../classes/app.error.js";
import { validatePassword } from "./helpers/comparePasswords.js";

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

  async requestChangePassword(
    userId: string,
    oldPassword: string,
  ): Promise<TChangePasswordResult> {
    const user = await this.userService.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundError("No user.");
    }

    validatePassword(oldPassword, user.hashedPassword);

    await this.mailService.sendChangePasswordEmail(
      { email: user.email, userId: user.id },
      `${user.firstName} ${user.lastName}`,
    );

    return {
      message: "Email was sent.",
    };
  }

  async changePassword(
    userId: string,
    dto: TChangePassword,
  ): Promise<IStandartResponse> {
    const user = await this.userService.findOne({
      where: { id: userId },
    });

    if (!userId) {
      throw new NotFoundError("No user found");
    }

    await this.tokenService.verifyChangePasswordToken(dto.token);

    const hashedPassword = await hashPassword(dto.password);

    await this.userService.updateOne({
      where: { id: userId },
      data: { hashedPassword: hashedPassword },
    });

    return {
      message: "Password is changed"
    }
  }
}
