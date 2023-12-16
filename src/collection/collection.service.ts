import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createCollectionDto, editCollectionDto } from './dto/collectionDto';
import { AppService } from 'src/app.service';
import { AppConfig } from 'src/shared';

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
    });
  }

  editCollection(
    id: number,
    { name, summary, cover, state }: editCollectionDto,
  ) {
    return this.prisma.collection.update({
      where: {
        id,
      },
      data: {
        name,
        summary,
        cover,
        state,
      },
    });
  }

  // 提供合集列表，提供一定的筛选功能
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
        id: true,
        name: true,
        summary: true,
        cover: true,
        state: true,
      },
    });
  }

  // 获取合集信息，包括合集中的番剧信息，分页返回
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
        id: true,
        name: true,
        summary: true,
        cover: true,
        state: true,
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
}
