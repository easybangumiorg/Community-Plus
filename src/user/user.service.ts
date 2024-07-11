import { Injectable, MethodNotAllowedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getLoginUser(email: string, password: string) {
    return await this.prismaService.user.findUnique({
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
    return await this.prismaService.user.findUnique({
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

  async create(data: CreateUserDto) {
    return await this.prismaService.user.create({
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

  async getProfile(id: number) {
    return await this.prismaService.user.findUnique({
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

  async updateProfile(
    id: number,
    data: Partial<UpdateProfileDto | CreateUserDto>,
  ) {
    return await this.prismaService.user.update({
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

  async deleteUser(id: number) {
    if (id === 1) {
      throw new MethodNotAllowedException('Can not delete the first user');
    }
    return await this.prismaService.user.delete({
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

  async getList(page: number, size: number, select: any = {}) {
    const [users, totalCount] = await Promise.all([
      this.prismaService.user.findMany({
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
      this.prismaService.user.count(),
    ]);
    const total = Math.ceil(totalCount / size);
    const has_next = page * size + users.length < totalCount;
    const has_prev = page > 0;
    const next = has_next ? page + 1 : null;
    return { users, total, has_next, has_prev, next, totalCount };
  }
}
