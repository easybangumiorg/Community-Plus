import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { $Enums } from '@prisma/client';
import { UserInfo } from './dto/userInfoDto';
import { AppService } from 'src/app.service';
import { AppConfig } from 'src/shared';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly app: AppService,
  ) {
    this.appConfig = this.app.getConfig();
  }

  private readonly appConfig: AppConfig;

  // 从ID获取用户完整信息
  getUserByID(id: number) {
    return this.prisma.user
      .findUnique({
        where: { id: id },
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

  // 从ID获取用户基本信息
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

  // 从账户名获取用户所有信息（登录用，请勿从接口返回）
  getUserByAccount(account: string) {
    return this.prisma.user.findUnique({
      where: { account: account },
    });
  }

  // 从ID与密码获取用户所有信息（修改密码用，请勿从接口返回）
  getPasswdUserByID(id: number, passwd: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
        password: passwd,
      },
    });
  }

  // 根据用户ID编辑用户基本信息
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

  // 分页获取用户列表
  getUserList(
    page: number = 0,
    pageSize: number = this.appConfig.defaultPageSize,
  ) {
    if (page < 0 || pageSize <= 0 || pageSize > this.appConfig.maxPageSize)
      throw new ForbiddenException({
        code: 403,
        msg: 'Invalid page or pageSize',
      });
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

  // 注册一个新用户
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

  // 从ID删除用户
  deleteUserByID(id: number) {
    return this.prisma.user.delete({
      where: { id: id },
      select: {
        password: false,
      },
    });
  }

  // 统计用户上传的番剧总数
  sumUserPosts(id: number) {
    return this.prisma.post.count({
      where: {
        authorId: id,
      },
    });
  }

  // 统计用户整理的合集总数
  sumUserCollections(id: number) {
    return this.prisma.collection.count({
      where: {
        userId: id,
      },
    });
  }

  // 重置用户密码
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

  // 编辑用户信息
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
