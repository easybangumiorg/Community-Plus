import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  getAllCategory() {
    return this.prisma.category.findMany();
  }

  getCategoryById(id: number) {
    return this.prisma.category.findUnique({
      where: { id },
    });
  }

  editCategory(id: number, name: string) {
    return this.prisma.category.update({
      where: { id },
      data: { name },
    });
  }

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

  addCategory(name: string) {
    return this.prisma.category.create({
      data: { name },
    });
  }

  deleteCategory(id: number) {
    return this.prisma.category.delete({
      where: { id },
    });
  }

  sumPostByCategoryId(id: number) {
    return this.prisma.post.count({
      where: { cid: id },
    });
  }
}
