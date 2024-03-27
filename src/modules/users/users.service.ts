import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import * as bcrypt from 'bcrypt';
import { Users } from '@prisma/client';
import { LoginUserDto } from './dto/login-user.dto';
import { TokenSender } from 'src/utils/sendToken';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    private readonly databasePrisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}
  public async hashingPassword(
    password: string,
    confirmPassword: string,
  ): Promise<string> {
    if (password !== confirmPassword) {
      throw new BadRequestException('your password doesnt match');
    }
    const saltNumber: number = 10;
    const hashPassword = await bcrypt.hash(password, saltNumber);
    return hashPassword;
  }
  public async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
  public async findEmail(email: string): Promise<Users> {
    const findEmailActive = await this.databasePrisma.users.findUnique({
      where: { email },
    });
    if (findEmailActive) {
      throw new BadRequestException('email hash been used');
    }
    return findEmailActive;
  }

  public async loginUsers(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.databasePrisma.users.findUnique({
      where: { email },
    });
    if (user && this.comparePassword(password, user.password)) {
      const tokenSender = new TokenSender(this.jwt, this.config);
      return tokenSender.sendToken(user);
    }
  }
}
