import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service.js";
import type {
  IAuthTokenPayload,
  IEmailConfirmationTokenPayload,
  ITokens,
} from "../token/token.interface.js";
import { FastifyReply } from "fastify";
import * as crypto from "crypto";
import type { IStandartResponse } from "types";

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  public async generateAuthTokens(
    payload: IAuthTokenPayload,
    res: FastifyReply,
  ): Promise<IStandartResponse> {
    const accessToken = this.jwtService.sign(
      { userId: payload.userId },
      {
        expiresIn: "15m",
        secret: this.configService.get<string>("ACCESS_TOKEN"),
      },
    );

    const refreshToken = this.jwtService.sign(
      { userId: payload.userId },
      {
        expiresIn: "7d",
        secret: this.configService.get<string>("REFRESH_TOKEN"),
      },
    );

    const hashedToken = this.hashToken(refreshToken);

    await this.prisma.token.deleteMany({
      where: { userId: payload.userId },
    });

    await this.prisma.token.create({
      data: {
        userId: payload.userId,
        token: hashedToken,
      },
    });

    return this.buildTokensResponse({ accessToken, refreshToken }, res);
  }

  public findUserRefreshTokenByUserId(userId: string) {
    return this.prisma.token.findFirst({
      where: {
        userId,
      },
    });
  }

  public async refreshTokens(
    rawRefreshToken: string,
    res: FastifyReply,
  ): Promise<IStandartResponse> {
    let payload: IAuthTokenPayload;
    try {
      payload = this.jwtService.verify(rawRefreshToken, {
        secret: this.configService.get<string>("REFRESH_TOKEN"),
      });
    } catch {
      throw new UnauthorizedException("Invalid or expired refresh token");
    }

    const hashedToken = this.hashToken(rawRefreshToken);
    const existingToken = await this.prisma.token.findFirst({
      where: {
        userId: payload.userId,
        token: hashedToken,
      },
    });

    if (!existingToken) {
      await this.prisma.token.deleteMany({
        where: { userId: payload.userId },
      });
      throw new UnauthorizedException(
        "Access revoked due to security violation",
      );
    }

    return this.generateAuthTokens(
      { userId: payload.userId, email: payload.email },
      res,
    );
  }

  public async logout(
    userId: string,
    res: FastifyReply,
  ): Promise<IStandartResponse> {
    await this.prisma.token.deleteMany({
      where: { userId },
    });

    res.clearCookie("accessToken", { path: "/" });
    res.clearCookie("refreshToken", { path: "/" });

    return { message: "Logged out successfully" };
  }

  private hashToken(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
  }

  private buildTokensResponse(
    dto: ITokens,
    res: FastifyReply,
  ): IStandartResponse {
    const isProduction = this.configService.get("NODE_ENV") === "production";
    res.clearCookie("accessToken", { path: "/" });
    res.clearCookie("refreshToken", { path: "/" });

    res.setCookie("accessToken", dto.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
      path: "/",
    });

    res.setCookie("refreshToken", dto.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return { message: "OK." };
  }

  public generateEmailConfirmationToken(email: string): string {
    return this.jwtService.sign(
      { email },
      {
        expiresIn: "1d",
        secret: this.configService.getOrThrow("EMAIL_CONFIRMATION_TOKEN"),
      },
    );
  }

  public verifyEmailConfirmationToken(token: string): { email: string } {
    return this.jwtService.verify(token, {
      secret: this.configService.getOrThrow("EMAIL_CONFIRMATION_TOKEN"),
    });
  }

  public async validateAuthToken(token: string): Promise<IAuthTokenPayload> {
    return this.jwtService.verify(token, {
      secret: this.configService.getOrThrow("ACCESS_TOKEN"),
    });
  }
}
