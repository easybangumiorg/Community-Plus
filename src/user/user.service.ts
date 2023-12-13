import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

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

  editUserProfileByID(id: number, name: string, bio: string, avatar: string) {
    return this.prisma.user.update({
      where: { id: id },
      data: {
        name: name,
        bio: bio,
        avatar: avatar,
      },
    });
  }
}
