import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { User } from "generated/prisma/client.js";
import { UserService } from "../../user/user.service.js";
import { IAuthTokenPayload } from "../../token/token.interface.js";
import { TokenService } from "../token.service.js";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  "RefreshTokenStrategy",
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          let token = null;
          if (req && req.cookies) {
            token = req.cookies["refreshToken"];
          }
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get("REFRESH_TOKEN")!,
    });
  }

  async validate({ userId }: IAuthTokenPayload): Promise<User | null> {
    const token = await this.tokenService.findUserRefreshTokenByUserId(userId);
    if (!token) {
      throw new ForbiddenException("No access.")
    }
    return await this.userService.findOne({ where: { id: userId } });
  }
}
