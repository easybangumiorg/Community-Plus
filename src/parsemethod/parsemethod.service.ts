import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePraseMethodDto } from './dto/create-prase.dto';
import { $Enums } from '@prisma/client';
import { UpdatePraseMethodDto } from './dto/update-prase.dto';

@Injectable()
export class ParsemethodService {
  constructor(private readonly prisma: PrismaService) {}

  async listParseMethods(page: number, size: number, where: any = {}) {
    const [items, totalCount] = await Promise.all([
      this.prisma.parseMethod.findMany({
        skip: (page - 1) * size,
        take: size,
        where,
        select: {
          id: true,
          createdAt: true,
          lastUpdate: true,
          authorId: false,
          author: {
            select: {
              id: true,
              name: true,
              bio: true,
              avatar: true,
            },
          },
          name: true,
          description: true,
          code: true,
          state: true,
          flow: false,
        },
      }),
      this.prisma.parseMethod.count(),
    ]);

    const total = Math.ceil(totalCount / size);
    const has_next = page * size + items.length < totalCount;
    const has_prev = page > 0;
    const next = has_next ? page + 1 : null;
    return { items, total, has_next, has_prev, next, totalCount };
  }

  async getParseMethod(id: number) {
    return this.prisma.parseMethod.findUnique({
      where: { id },
      select: {
        id: true,
        createdAt: true,
        lastUpdate: true,
        authorId: false,
        author: {
          select: {
            id: true,
            name: true,
            bio: true,
            avatar: true,
          },
        },
        name: true,
        description: true,
        code: true,
        state: true,
        flow: true,
      },
    });
  }

  async createParseMethod(userId: number, data: CreatePraseMethodDto) {
    return this.prisma.parseMethod.create({
      data: {
        ...data,
        flow: {},
        state: $Enums.SiteState.DRAFT,
        authorId: userId,
      },
    });
  }

  async updateParseMethod(id: number, data: UpdatePraseMethodDto) {
    return this.prisma.parseMethod.update({
      where: { id },
      data: {
        ...data,
        lastUpdate: new Date(),
      },
    });
  }

  async deleteParseMethod(id: number) {
    return this.prisma.parseMethod.delete({ where: { id } });
  }
}
