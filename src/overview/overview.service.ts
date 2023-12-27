import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

/**
 * # 概览服务
 *
 * 获取数据库中各项指标数据：
 * 1. 用户：数量
 * 2. 分类：各分类番剧数量
 * 3. 番剧：总数、未发布、已发布、最近更新
 * 4. 合集：总数、公开合集数量、最近更新
 *
 * 获取指定用户的数据：
 * 1. 创建番剧数量，公开番剧数量，草稿数量
 * 2. 创建合集数量，公开合集数量，草稿数量
 */
@Injectable()
export class OverviewService {
  constructor(
    private readonly prisma: PrismaService,
    // eslint-disable-next-line prettier/prettier
  ) { }

  async getOverview() {
    const [
      user,
      totalPost,
      onReadyPubPost,
      publishedPost,
      recentlyUpdatedPost,
      category,
      totalCollection,
      draftCollection,
      publishedCollection,
      recentlyUpdatedCollection,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.post.count(),
      this.prisma.post.count({ where: { onReadyPub: true } }),
      this.prisma.post.count({ where: { published: true } }),
      this.prisma.post.count({
        where: {
          lastUpdate: { gt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
        },
      }),
      this.prisma.category.findMany({
        select: {
          name: true,
          _count: {
            select: {
              posts: true,
            },
          },
        },
      }),
      this.prisma.collection.count(),
      this.prisma.collection.count({ where: { state: 'DRAFT' } }),
      this.prisma.collection.count({
        where: { state: { notIn: ['DRAFT'] } },
      }),
      this.prisma.collection.count({
        where: {
          lastUpdate: { gt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
        },
      }),
    ]);

    return {
      user: { count: user },
      post: {
        count: totalPost,
        onReadyPub: onReadyPubPost,
        published: publishedPost,
        recentlyUpdated: recentlyUpdatedPost,
      },
      category: category.map((c) => ({
        name: c.name,
        count: c._count.posts,
      })),
      collection: {
        count: totalCollection,
        draft: draftCollection,
        published: publishedCollection,
        recentlyUpdated: recentlyUpdatedCollection,
      },
    };
  }

  async getUserOverview(userId: number) {
    const [
      post,
      pubPost,
      draftPost,
      collection,
      pubCollection,
      draftCollection,
    ] = await Promise.all([
      this.prisma.post.count({ where: { authorId: userId } }),
      this.prisma.post.count({
        where: { authorId: userId, published: true },
      }),
      this.prisma.post.count({
        where: { authorId: userId, published: false },
      }),
      this.prisma.collection.count({ where: { userId: userId } }),
      this.prisma.collection.count({
        where: { userId: userId, state: { notIn: ['DRAFT'] } },
      }),
      this.prisma.collection.count({
        where: { userId: userId, state: 'DRAFT' },
      }),
    ]);

    return {
      post: { count: post, published: pubPost, draft: draftPost },
      collection: {
        count: collection,
        published: pubCollection,
        draft: draftCollection,
      },
    };
  }
}
