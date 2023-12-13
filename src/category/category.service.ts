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

  getPostByCategoryId(id: number, page: number, pageSize: number) {
    return this.prisma.post.findMany({
      skip: page * pageSize,
      take: pageSize,
      where: { cid: id },
    });
  }
}
