import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Users } from '@prisma/client';

export class TokenSender {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async sendToken(user: Users) {
    const accessToken = await this.jwtService.signAsync(
      { id: user.id },
      {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
        expiresIn: '1m',
      },
    );
    const refreshToken = await this.jwtService.signAsync(
      { id: user.id },
      {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
        expiresIn: '3d',
      },
    );
    return { user, accessToken, refreshToken };
  }
}
