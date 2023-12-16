import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createPostDto, editPostDto } from './dto/postDto';
import { AppService } from 'src/app.service';
import { AppConfig } from 'src/shared';

const select_exclude_data = {
  id: true,
  createdAt: true,
  lastUpdate: true,
  published: true,
  authorId: true,
  cid: true,
  title: true,
  summary: true,
  cover: true,
  tags: true,
  postStatus: true,
  status: true,
};

/**
 * 番剧服务
 * !在添加和修改番剧时，应进行解包操作，防止用户传入不必要的数据
 */

@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly app: AppService,
  ) {
    this.appConfig = this.app.getConfig();
  }

  private readonly appConfig: AppConfig;

  // 获取番剧列表，提供一定的筛选功能
  getPostList(
    page: number = 0,
    pageSize: number = this.appConfig.defaultPageSize,
    { cid, authorId, published, postStatus, nsfw, onReadyPub },
  ) {
    if (page < 0 || pageSize <= 0 || pageSize > this.appConfig.maxPageSize)
      throw new ForbiddenException({
        code: 403,
        msg: 'Invalid page or pageSize',
      });
    return this.prisma.post.findMany({
      skip: page * pageSize,
      take: pageSize,
      where: {
        cid,
        authorId,
        published,
        postStatus,
        nsfw,
        onReadyPub,
      },
      select: select_exclude_data,
    });
  }

  // 获取番剧信息
  getPost(id: number) {
    return this.prisma.post.findUnique({
      where: {
        id,
      },
      select: {
        ...select_exclude_data,
        author: {
          select: {
            id: true,
            name: true,
            bio: true,
            avatar: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
        data: true,
      },
    });
  }

  // 查看番剧是否属于用户
  checkPostIsUser(id: number, uid: number) {
    return this.prisma.post
      .findFirst({
        where: {
          id,
          authorId: uid,
        },
      })
      .then((res) => {
        if (res) {
          return true;
        } else {
          return false;
        }
      });
  }

  // 新增番剧
  addPost(authorId: number, post: createPostDto) {
    const { cid, title, cover, summary, tags, postStatus, status, nsfw } = post;
    return this.prisma.post.create({
      data: {
        cid,
        authorId,
        title,
        cover,
        summary,
        tags,
        postStatus,
        status,
        nsfw,
        data: {},
      },
    });
  }

  // 修改番剧
  updatePost(id: number, post: editPostDto) {
    const { cid, title, cover, summary, tags, postStatus, status, nsfw } = post;
    return this.prisma.post.update({
      where: {
        id,
      },
      data: {
        cid,
        title,
        cover,
        summary,
        tags,
        postStatus,
        status,
        nsfw,
        lastUpdate: new Date(),
      },
    });
  }

  // 设置番剧主体数据
  setPostData(id: number, data: any) {
    return this.prisma.post
      .update({
        where: {
          id,
        },
        data: {
          data,
          lastUpdate: new Date(),
        },
      })
      .then((res) => {
        return res.data;
      });
  }

  // 获取番剧主体数据
  getPostData(id: number) {
    return this.prisma.post
      .findUnique({
        where: {
          id,
        },
        select: {
          data: true,
        },
      })
      .then((res) => {
        return res.data;
      });
  }

  // 删除番剧
  deletePost(id: number) {
    return this.prisma.post.delete({
      where: {
        id,
      },
      select: {
        id: true,
        authorId: true,
        cid: true,
        title: true,
      },
    });
  }

  // 检查番剧是否被合集引用
  checkPostInCollection(id: number) {
    return this.prisma.collection.count({
      where: {
        posts: {
          some: {
            id,
          },
        },
      },
    });
  }

  setPostReady(id: number, ready: boolean) {
    return this.prisma.post.update({
      where: {
        id,
      },
      data: {
        onReadyPub: ready,
      },
      select: {
        id: true,
        onReadyPub: true,
      },
    });
  }

  setPostPublish(id: number, publish: boolean) {
    return this.prisma.post.update({
      where: {
        id,
      },
      data: {
        published: publish,
      },
      select: {
        id: true,
        published: true,
      },
    });
  }
}
