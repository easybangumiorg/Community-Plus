import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createPostDto, editPostDto } from './dto/postDto';

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

@Injectable()
export class PostService {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly prisma: PrismaService) { }

  // 获取番剧列表，提供一定的筛选功能
  getPostList(
    page: number,
    pageSize: number,
    { cid, authorId, published, postStatus, nsfw, onReadyPub },
  ) {
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
  addPost(create: createPostDto) {
    return this.prisma.post.create({
      data: {
        ...create,
        data: {},
      },
    });
  }

  // 修改番剧
  updatePost(id: number, post: editPostDto) {
    return this.prisma.post.update({
      where: {
        id,
      },
      data: {
        ...post,
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
