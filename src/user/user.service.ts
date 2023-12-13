import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { $Enums } from '@prisma/client';
import { UserInfo } from './dto/userInfoDto';

@Injectable()
export class UserService {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly prisma: PrismaService) { }

  getUserByID(id: number) {
    return this.prisma.user
      .findUnique({
        where: { id: id },
        select: {
          id: true,
          account: true,
          createdAt: true,
          role: true,
          email: true,
          name: true,
          bio: true,
          avatar: true,
        },
      })
      .then((user) => {
        if (!user)
          throw new BadRequestException({
            code: 400,
            msg: 'Invalid user id',
          });
        return user;
      })
      .then((user) => {
        return {
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
      });
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

  getPasswdUserByID(id: number, passwd: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
        password: passwd,
      },
    });
  }

  editUserProfileByID(id: number, name: string, bio: string, avatar: string) {
    return this.prisma.user.update({
      where: { id: id },
      data: {
        name,
        bio,
        avatar,
      },
    });
  }

  getUserList(page: number, pageSize: number) {
    return this.prisma.user.findMany({
      skip: page * pageSize,
      take: pageSize,
      select: {
        id: true,
        account: true,
        createdAt: true,
        role: true,
        email: true,
        name: true,
        bio: true,
        avatar: true,
      },
    });
  }

  signUpUser(account: string, password: string) {
    return this.prisma.user
      .create({
        data: {
          account,
          password,
          name: account,
          role: 'USER',
        },
      })
      .then((user) => {
        return {
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
      });
  }

  deleteUserByID(id: number) {
    return this.prisma.user.delete({
      where: { id: id },
      select: {
        password: false,
      },
    });
  }

  sumUserPosts(id: number) {
    return this.prisma.post
      .findMany({
        where: {
          authorId: id,
        },
        select: {
          id: true,
        },
      })
      .then((col) => col.length);
  }

  sumUserCollections(id: number) {
    return this.prisma.collection
      .findMany({
        where: {
          userId: id,
        },
        select: {
          id: true,
        },
      })
      .then((col) => col.length);
  }

  editUserPasswd(id: number, password: string) {
    return this.prisma.user.update({
      where: { id: id },
      data: {
        password,
      },
      select: {
        id: true,
        account: true,
        name: true,
        bio: true,
        avatar: true,
      },
    });
  }

  editUserByID(
    id: number,
    { account, email, role, name, bio, avatar }: UserInfo,
  ) {
    if (role && !(role in $Enums.Role))
      throw new BadRequestException({
        code: 400,
        msg: 'Invalid role',
      });
    return this.prisma.user.update({
      where: { id: id },
      data: {
        account,
        email,
        role,
        name,
        bio,
        avatar,
      },
      select: {
        id: true,
        account: true,
        name: true,
        bio: true,
        avatar: true,
      },
    });
  }
}
