import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

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
  editCategory(id: number, name: string) {
    return this.prisma.category.update({
      where: { id },
      data: { name },
    });
  }

  // 获取分类下的番剧
  getPostByCategoryId(
    id: number,
    page: number,
    pageSize: number,
    require_all: boolean,
  ) {
    if (require_all) {
      return this.prisma.post.findMany({
        skip: page * pageSize,
        take: pageSize,
        where: { cid: id },
      });
    } else {
      return this.prisma.post.findMany({
        skip: page * pageSize,
        take: pageSize,
        where: { cid: id, published: true },
      });
    }
  }

  // 新增分类
  addCategory(name: string) {
    return this.prisma.category.create({
      data: { name },
    });
  }

  // 删除分类
  deleteCategory(id: number) {
    return this.prisma.category.delete({
      where: { id },
    });
  }

  // 获取分类下的番剧数量
  sumPostByCategoryId(id: number) {
    return this.prisma.post.count({
      where: { cid: id },
    });
  }
}
