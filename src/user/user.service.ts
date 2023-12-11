import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async signIn(account: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { account: account },
    });
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
    const payload = {
      id: user.id,
      acc: user.account,
      rol: user.role,
    };
    return {
      token: this.jwt.sign(payload),
      user,
    };
  }

  getUserProfileByID(id: number) {
    return this.prisma.user.findUnique({
      where: { id: id },
      select: {
        name: true,
        bio: true,
        avatar: true,
      },
    });
  }

  getUserByAccount(account: string) {
    return this.prisma.user.findUnique({
      where: { account: account },
    });
  }
}
