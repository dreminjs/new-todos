import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Prisma, Token } from "api/generated/prisma/client.js";
import { PrismaService } from "../prisma/prisma.service.js";
import type {
  IAuthTokenPayload,
  IEmailConfirmationTokenPayload,
  ITokens,
} from "../token/token.interface.js";
import { FastifyReply } from "fastify";
import type { IStandartResponse } from "types";

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  private logger = new Logger(TokenService.name);

  public async deleteOne(args: Prisma.TokenDeleteArgs): Promise<Token> {
    return await this.prisma.token.delete(args);
  }

  public async generateAuthTokens(
    payload: IAuthTokenPayload,
    res: FastifyReply,
  ): Promise<IStandartResponse> {
    const oldToken = await this.findOne({ userId: payload.userId });

    if (oldToken) {
      await this.deleteOne({
        where: {
          userId: payload.userId,
          token: oldToken.token,
        },
      });
    }

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: "1d",
      secret: this.configService.get("ACCESS_TOKEN"),
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: "1w",
      secret: this.configService.get("REFRESH_TOKEN"),
    });

    await this.saveRefreshToken({
      user: {
        connect: {
          id: payload.userId,
        },
      },
      token: refreshToken,
    });

    return this.buildTokensResponse({ accessToken, refreshToken }, res);
  }

  public async validateAuthToken(token: string): Promise<IAuthTokenPayload> {
    return this.jwtService.verify(token, {
      secret: this.configService.get("ACCESS_TOKEN"),
    });
  }

  private async saveRefreshToken(
    payload: Prisma.TokenCreateInput,
  ): Promise<Token> {
    return await this.prisma.token.create({ data: payload });
  }

  public async findOne(where: Prisma.TokenWhereInput): Promise<Token | null> {
    return await this.prisma.token.findFirst({
      where,
    });
  }

  public async deleteRefreshToken(where: Prisma.TokenWhereUniqueInput) {
    return await this.prisma.token.delete({ where });
  }

  private buildTokensResponse(
    dto: ITokens,
    res: FastifyReply,
  ): IStandartResponse {
    res.setCookie("accessToken", dto.accessToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.setCookie("refreshToken", dto.refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    return {
      message: "OK.",
    };
  }

  generateEmailConfirmationToken(email: string): string {
    return this.jwtService.sign(
      { email },
      {
        expiresIn: "1d",
        secret: this.configService.get("EMAIL_CONFIRMATION_TOKEN"),
      },
    );
  }

  verifyEmailConfirmationToken(token: string): IEmailConfirmationTokenPayload {
    return this.jwtService.verify(token, {
      secret: this.configService.get("EMAIL_CONFIRMATION_TOKEN"),
    });
  }
}
