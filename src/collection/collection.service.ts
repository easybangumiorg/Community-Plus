import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Injectable()
export class CollectionService {
  constructor(private readonly prisma: PrismaService) {}

  async createCollection(authorId: number, data: CreateCollectionDto) {
    return await this.prisma.collection.create({
      data: {
        ...data,
        author: {
          connect: {
            id: authorId,
          },
        },
      },
    });
  }

  async getCollectionInfo(id: number) {
    return await this.prisma.collection.findUnique({
      where: {
        id,
      },
    });
  }

  async updateCollection(id: number, data: UpdateCollectionDto) {
    return await this.prisma.collection.update({
      where: {
        id,
      },
      data: {
        ...data,
        lastUpdate: new Date(),
      },
    });
  }

  async deleteCollection(id: number) {
    return await this.prisma.collection.delete({
      where: {
        id,
      },
    });
  }

  async findUserCollection(authorId: number, id: number) {
    return await this.prisma.collection.findUnique({
      where: {
        id,
        authorId,
      },
    });
  }

  async getCollectionList(
    page: number = 0,
    size: number = 20,
    where: any = {},
  ) {
    const [items, totalCount] = await Promise.all([
      this.prisma.collection.findMany({
        skip: page * size,
        take: size,
        where,
      }),
      this.prisma.collection.count({
        where,
      }),
    ]);

    const total = Math.ceil(totalCount / size);
    const has_next = page * size + items.length < totalCount;
    const has_prev = page > 0;
    const next = has_next ? page + 1 : null;
    return { items, total, has_next, has_prev, next, totalCount };
  }

  async listCollectionItemsByID(
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
          collectionId: id,
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
        where: { ...where, collectionId: id },
      }),
    ]);

    const total = Math.ceil(totalCount / size);
    const has_next = page * size + items.length < totalCount;
    const has_prev = page > 0;
    const next = has_next ? page + 1 : null;
    return { items, total, has_next, has_prev, next, totalCount };
  }

  async removeItemsFromCollection(collectionId: number, postIds: number[]) {
    return await this.prisma.collection.update({
      where: {
        id: collectionId,
      },
      data: {
        posts: {
          disconnect: postIds.map(id => ({ id })),
        },
      },
    });
  }

  async addItemsToCollection(collectionId: number, postIds: number[]) {
    return await this.prisma.collection.update({
      where: {
        id: collectionId,
      },
      data: {
        posts: {
          connect: postIds.map(id => ({ id })),
        },
      },
    });
  }

  async getPostInfosByIDs(ids: number[]) {
    return await this.prisma.post.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      select: {
        id: true,
        authorId: true,
        state: true,
      },
    });
  }
}
