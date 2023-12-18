import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createCollectionDto, editCollectionDto } from './dto/collectionDto';
import { AppService } from 'src/app.service';
import { AppConfig } from 'src/shared';
import { $Enums } from '@prisma/client';

const select_only_info = {
  id: true,
  name: true,
  summary: true,
  cover: true,
  state: true,
};

@Injectable()
export class CollectionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly app: AppService,
  ) {
    this.appConfig = this.app.getConfig();
  }

  private readonly appConfig: AppConfig;

  createCollection(
    userId: number,
    { name, summary, cover }: createCollectionDto,
  ) {
    return this.prisma.collection.create({
      data: {
        name,
        summary,
        cover,
        userId: userId,
      },
      select: {
        ...select_only_info,
      },
    });
  }

  editCollection(id: number, { name, summary, cover }: editCollectionDto) {
    return this.prisma.collection.update({
      where: {
        id,
      },
      data: {
        name,
        summary,
        cover,
        lastUpdate: new Date(),
      },
      select: {
        ...select_only_info,
      },
    });
  }

  listCollection(
    page: number = 0,
    pageSize: number = this.appConfig.defaultPageSize,
    { userId, state },
  ) {
    if (page < 0 || pageSize <= 0 || pageSize > this.appConfig.maxPageSize)
      throw new ForbiddenException({
        code: 403,
        msg: 'Invalid page or pageSize',
      });
    return this.prisma.collection.findMany({
      skip: page * pageSize,
      take: pageSize,
      where: {
        userId,
        state,
      },
      select: {
        ...select_only_info,
      },
    });
  }

  getCollection(
    id: number,
    page: number = 0,
    pageSize: number = this.appConfig.defaultPageSize,
  ) {
    if (page < 0 || pageSize <= 0 || pageSize > this.appConfig.maxPageSize)
      throw new ForbiddenException({
        code: 403,
        msg: 'Invalid page or pageSize',
      });
    return this.prisma.collection.findUnique({
      where: {
        id,
      },
      select: {
        ...select_only_info,
        posts: {
          skip: page * pageSize,
          take: pageSize,
          select: {
            id: true,
            title: true,
            summary: true,
            cover: true,
            tags: true,
            postStatus: true,
            status: true,
          },
        },
      },
    });
  }

  sumPostInCollection(id: number) {
    // 获取合集中的番剧数量
    return this.prisma.post.count({
      where: {
        collection: {
          some: {
            id,
          },
        },
      },
    });
  }

  deleteCollection(id: number) {
    return this.prisma.collection.delete({
      where: {
        id,
      },
      select: {
        ...select_only_info,
      },
    });
  }

  appendPost(id: number, postId: number) {
    return this.prisma.collection.update({
      where: {
        id,
      },
      data: {
        posts: {
          connect: {
            id: postId,
          },
        },
        lastUpdate: new Date(),
      },
      select: {
        ...select_only_info,
      },
    });
  }

  removePost(id: number, postId: number) {
    return this.prisma.collection.update({
      where: {
        id,
      },
      data: {
        posts: {
          disconnect: {
            id: postId,
          },
        },
      },
      select: {
        ...select_only_info,
      },
    });
  }

  checkCollectionIsUser(id: number, userId: number) {
    return this.prisma.collection.findUnique({
      where: {
        id,
        userId,
      },
      select: {
        id: true,
      },
    });
  }

  setState(id: number, state: $Enums.CollectionState) {
    return this.prisma.collection.update({
      where: {
        id,
      },
      data: {
        state,
      },
      select: {
        ...select_only_info,
      },
    });
  }
}
