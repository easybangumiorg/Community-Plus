import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { jwtPayload } from './dto/jwtPayload';
import { userSignInDto } from './dto/userSignDto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly userService: UserService,
  ) {}

  async signIn(account: string, password: string): Promise<userSignInDto> {
    const user = await this.userService.getUserByAccount(account);
    if (!user)
      throw new UnauthorizedException({
        code: 401,
        msg: 'Invalid account or password',
      });
    if (user.password !== password)
      throw new UnauthorizedException({
        code: 401,
        msg: 'Invalid account or password',
      });
    const payload: jwtPayload = {
      id: user.id,
      acc: user.account,
      rol: user.role,
    };
    return {
      token: await this.jwt.signAsync(payload),
      id: user.id,
      account: user.account,
      createdAt: user.createdAt,
      role: user.role,
      email: user.email,
      profile: {
        name: user.name,
        bio: user.bio,
        avatar: user.avatar,
      },
    };
  }
}
