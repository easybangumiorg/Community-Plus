import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreatePlaylineDto } from './dto/create-playline.dto';
import { UpdatePlaylineDto } from './dto/update-playline.dto';
import { CreatePlaylineItemDto } from './dto/create-playlineitem.dto';
import { UpdatePlaylineItemDto } from './dto/update-playlineitem.dto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async createPost(authorId: number, data: CreatePostDto) {
    return await this.prisma.post.create({
      data: {
        ...data,
        authorId,
      },
    });
  }

  async updatePost(id: number, data: UpdatePostDto) {
    return await this.prisma.post.update({
      where: { id },
      data: {
        lastUpdate: new Date(),
        ...data,
      },
    });
  }

  async deletePost(id: number) {
    return await this.prisma.post.delete({
      where: { id },
    });
  }

  async getPostById(id: number) {
    return await this.prisma.post.findUnique({
      where: { id },
      select: {
        id: true,
        createdAt: true,
        lastUpdate: true,
        author: {
          select: {
            id: true,
            name: true,
            bio: true,
            avatar: true,
          },
        },
        categoryId: true,
        playLines: { select: { id: true, title: true } },
        tags: { select: { id: true, name: true } },
        state: true,
        updateState: true,
        updateAt: true,
        nsfw: true,
        title: true,
        publishedDate: true,
        summary: true,
        cover: true,
        extendmetaData: true,
      },
    });
  }

  async listPosts(page: number, size: number, where: any = {}) {
    const [items, totalCount] = await Promise.all([
      this.prisma.post.findMany({
        skip: page * size,
        take: size,
        where,
        select: {
          id: true,
          createdAt: true,
          lastUpdate: true,
          author: {
            select: {
              id: true,
              name: true,
              bio: true,
              avatar: true,
            },
          },
          categoryId: true,
          playLines: { select: { id: true, title: true } },
          tags: { select: { id: true, name: true } },
          state: true,
          updateState: true,
          updateAt: true,
          nsfw: true,
          title: true,
          publishedDate: true,
          summary: true,
          cover: true,
          extendmetaData: true,
        },
      }),
      this.prisma.post.count({ where }),
    ]);

    const total = Math.ceil(totalCount / size);
    const has_next = page * size + items.length < totalCount;
    const has_prev = page > 0;
    const next = has_next ? page + 1 : null;
    return { items, total, has_next, has_prev, next, totalCount };
  }

  async postAddTag(postId: number, tagIds: number[]) {
    return await this.prisma.post.update({
      where: { id: postId },
      data: {
        tags: { connect: tagIds.map(id => ({ id })) },
      },
    });
  }

  async postRemoveTag(postId: number, tagIds: number[]) {
    return await this.prisma.post.update({
      where: { id: postId },
      data: {
        tags: { disconnect: tagIds.map(id => ({ id })) },
      },
    });
  }

  async postCreatePlayLine(postId: number, data: CreatePlaylineDto) {
    return await this.prisma.playLine.create({
      data: {
        ...data,
        postId,
      },
    });
  }

  async updatePlayLine(id: number, data: UpdatePlaylineDto) {
    return await this.prisma.playLine.update({
      where: { id },
      data: {
        ...data,
      },
    });
  }

  async deletePlayLine(id: number) {
    await this.prisma.playLineItem.deleteMany({ where: { playLineId: id } });
    return await this.prisma.playLine.delete({ where: { id } });
  }

  async getPlayLineById(id: number) {
    return await this.prisma.playLine.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        playLineItem: {
          select: {
            id: true,
            title: true,
            item: true,
          },
        },
      },
    });
  }

  async insertPlayLineItem(playLineId: number, data: CreatePlaylineItemDto) {
    return await this.prisma.playLineItem.create({
      data: {
        ...data,
        playLineId,
      },
    });
  }

  async updatePlayLineItem(id: number, data: UpdatePlaylineItemDto) {
    return await this.prisma.playLineItem.update({
      where: { id },
      data: {
        ...data,
      },
    });
  }

  async deletePlayLineItem(id: number) {
    return await this.prisma.playLineItem.delete({ where: { id } });
  }
}
