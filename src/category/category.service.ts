import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  // 获取所有分类
  getAllCategory() {
    return this.prisma.category.findMany();
  }

  // 获取分类信息
  getCategoryById(id: number) {
    return this.prisma.category.findUnique({
      where: { id },
    });
  }

  // 修改分类信息
  updateCategory(id: number, data: UpdateCategoryDto) {
    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  // 新增分类
  createCategory(data: CreateCategoryDto) {
    return this.prisma.category.create({
      data,
    });
  }

  // 删除分类
  deleteCategory(id: number) {
    return this.prisma.category.delete({
      where: { id },
    });
  }

  // 获取分类下的番剧
  async getPostByCategoryId(
    id: number,
    page: number = 0,
    size: number = 20,
    where: any = {},
  ) {
    const [items, totalCount] = await Promise.all([
      this.prisma.post.findMany({
        skip: page * size,
        take: size,
        where: {
          ...where,
          categoryId: id,
        },
        select: {
          id: true,
          createdAt: true,
          lastUpdate: true,
          author: {
            select: { name: true, id: true, avatar: true, bio: true },
          },
          state: true,
          updateState: true,
          nsfw: true,
          title: true,
          publishDate: true,
          summary: true,
          cover: true,
          tags: {
            select: { name: true },
          },
        },
      }),
      this.prisma.post.count({
        where: { ...where, categoryId: id },
      }),
    ]);

    const total = Math.ceil(totalCount / size);
    const has_next = page * size + items.length < totalCount;
    const has_prev = page > 0;
    const next = has_next ? page + 1 : null;
    return { items, total, has_next, has_prev, next, totalCount };
  }
}
