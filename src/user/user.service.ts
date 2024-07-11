import { Injectable, MethodNotAllowedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getLoginUser(email: string, password: string) {
    return await this.prisma.user.findUnique({
      where: { email, password },
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        avatar: true,
        role: true,
      },
    });
  }

  async getPasswdUserByID(id: number, password: string) {
    return await this.prisma.user.findUnique({
      where: { id, password },
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        avatar: true,
        role: true,
      },
    });
  }

  async createUser(data: CreateUserDto) {
    return await this.prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        avatar: true,
        role: true,
      },
    });
  }

  async getProfileByID(id: number) {
    return await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        avatar: true,
        role: true,
      },
    });
  }

  async updateProfileByID(
    id: number,
    data: Partial<UpdateProfileDto | CreateUserDto>,
  ) {
    return await this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        avatar: true,
        role: true,
      },
    });
  }

  async deleteUserByID(id: number) {
    if (id === 1) {
      throw new MethodNotAllowedException('Can not delete the first user');
    }
    return await this.prisma.user.delete({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        avatar: true,
        role: true,
      },
    });
  }

  async getUserList(page: number, size: number, select: any = {}) {
    const [users, totalCount] = await Promise.all([
      this.prisma.user.findMany({
        skip: page * size,
        take: size,
        where: select,
        select: {
          id: true,
          email: true,
          name: true,
          bio: true,
          avatar: true,
          role: true,
        },
      }),
      this.prisma.user.count(),
    ]);
    const total = Math.ceil(totalCount / size);
    const has_next = page * size + users.length < totalCount;
    const has_prev = page > 0;
    const next = has_next ? page + 1 : null;
    return { users, total, has_next, has_prev, next, totalCount };
  }
}
