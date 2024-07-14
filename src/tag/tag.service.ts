import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TagService {
  constructor(private readonly prisma: PrismaService) {}

  async getTag(name: string) {
    // 根据标签名获取标签, 如果有则返回标签, 没有则创建一个新的标签
    const tag = await this.prisma.postTag.findUnique({
      where: { name },
      include: { _count: { select: { posts: true } } },
    });
    if (tag) {
      return tag;
    }
    return await this.prisma.postTag.create({
      data: {
        name,
      },
      include: { _count: { select: { posts: true } } },
    });
  }

  async deleteTag(id: number) {
    return await this.prisma.postTag.delete({
      where: { id },
    });
  }

  async listTags(page: number, size: number) {
    const [items, totalCount] = await Promise.all([
      this.prisma.postTag.findMany({
        skip: (page - 1) * size,
        take: size,
        include: {
          _count: { select: { posts: true } },
        },
      }),
      this.prisma.postTag.count(),
    ]);

    const total = Math.ceil(totalCount / size);
    const has_next = page * size + items.length < totalCount;
    const has_prev = page > 0;
    const next = has_next ? page + 1 : null;
    return { items, total, has_next, has_prev, next, totalCount };
  }

  async listTagItems(
    tagId: number,
    page: number,
    size: number,
    where: any = {},
  ) {
    const [items, totalCount] = await Promise.all([
      this.prisma.post.findMany({
        where: { tags: { some: { id: tagId } }, ...where },
        skip: (page - 1) * size,
        take: size,
      }),
      this.prisma.post.count({
        where: { tags: { some: { id: tagId } } },
        ...where,
      }),
    ]);

    const total = Math.ceil(totalCount / size);
    const has_next = page * size + items.length < totalCount;
    const has_prev = page > 0;
    const next = has_next ? page + 1 : null;
    return { items, total, has_next, has_prev, next, totalCount };
  }
}
