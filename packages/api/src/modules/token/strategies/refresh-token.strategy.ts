import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { User } from 'generated/prisma/client.js';
import { UserService } from '../../user/user.service.js';
import { IAuthTokenPayload } from '../../token/token.interface.js';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'RefreshTokenStrategy',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          let token = null;
          if (req && req.cookies) {
            token = req.cookies['refreshToken'];
          }
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('REFRESH_TOKEN')!,
    });
  }

  async validate({ userId }: IAuthTokenPayload): Promise<User | null> {
    return await this.userService.findOne({ where: { id: userId } });
  }
}
