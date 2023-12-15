import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PostService } from './post.service';
import { NeedPermission, ResponseDto, checkPermission } from 'src/shared';
import { AuthGuard } from 'src/user/auth.guard';
import { createPostDto, editPostDto } from './dto/postDto';

@Controller('post')
export class PostController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly post: PostService) { }

  @NeedPermission('post.list')
  @UseGuards(AuthGuard)
  @Post('list')
  async getPostList(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Body() query: any,
  ): Promise<ResponseDto<any>> {
    page = Number(page);
    pageSize = Number(pageSize);
    return {
      code: 200,
      msg: 'success',
      data: await this.post.getPostList(page, pageSize, query),
    };
  }

  @NeedPermission('post.add')
  @UseGuards(AuthGuard)
  @Post('add')
  async addPost(
    @Body() post: createPostDto,
    @Request() { user },
  ): Promise<ResponseDto<any>> {
    const { cid, title, cover, summary, tags, postStatus, status, nsfw } = post;
    return {
      code: 200,
      msg: 'success',
      data: await this.post.addPost({
        cid,
        title,
        cover,
        summary,
        tags,
        postStatus,
        status,
        nsfw,
        authorId: user.id,
      }),
    };
  }

  @NeedPermission('post.data.set')
  @UseGuards(AuthGuard)
  @Post(':id/data')
  async setPostData(
    @Param('id') id: number,
    @Body() data: any,
    @Request() { user },
  ): Promise<ResponseDto<any>> {
    id = Number(id);
    if (
      !checkPermission(user.rol, 'post.data.set.overuser') &&
      !(await this.post.checkPostIsUser(id, user.id))
    ) {
      throw new ForbiddenException({
        code: 403,
        msg: 'Permission denied',
      });
    }
    return {
      code: 200,
      msg: 'success',
      data: await this.post.setPostData(id, data),
    };
  }

  @NeedPermission('post.data.get')
  @UseGuards(AuthGuard)
  @Get(':id/data')
  async getPostData(@Param('id') id: number): Promise<ResponseDto<any>> {
    id = Number(id);
    return {
      code: 200,
      msg: `success get data of id:${id}`,
      data: await this.post.getPostData(id),
    };
  }

  @NeedPermission('post.update')
  @UseGuards(AuthGuard)
  @Post(':id')
  async updatePost(
    @Param('id') id: number,
    @Body() post: editPostDto,
    @Request() { user },
  ): Promise<ResponseDto<any>> {
    id = Number(id);
    if (
      !checkPermission(user.rol, 'post.update.overuser') &&
      !(await this.post.checkPostIsUser(id, user.id))
    ) {
      // 用户没在编辑组内且想要编辑别人的番剧
      throw new ForbiddenException({
        code: 403,
        msg: 'Permission denied',
      });
    }
    return {
      code: 200,
      msg: 'success',
      data: await this.post.updatePost(id, post),
    };
  }

  @NeedPermission('post.get')
  @UseGuards(AuthGuard)
  @Get(':id')
  async getPost(@Param('id') id: number): Promise<ResponseDto<any>> {
    id = Number(id);
    return {
      code: 200,
      msg: 'success',
      data: await this.post.getPost(id),
    };
  }

  @NeedPermission('post.delete')
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deletePost(@Param('id') id: number): Promise<ResponseDto<any>> {
    id = Number(id);
    const count = await this.post.checkPostInCollection(id);
    if (count > 0) {
      throw new ForbiddenException({
        code: 403,
        msg: 'post is referenced by the collection',
      });
    }
    return {
      code: 200,
      msg: 'success',
      data: await this.post.deletePost(id),
    };
  }

  @NeedPermission('post.state.ready')
  @UseGuards(AuthGuard)
  @Get(':id/ready')
  async setPostReadyTrue(
    @Param('id') id: number,
    @Request() { user },
    @Query('state') ready: boolean,
  ): Promise<ResponseDto<any>> {
    id = Number(id);
    ready = true ? String(ready) === 'true' : false;
    if (
      !checkPermission(user.rol, 'post.state.ready.overuser') &&
      !(await this.post.checkPostIsUser(id, user.id))
    ) {
      throw new ForbiddenException({
        code: 403,
        msg: 'Permission denied',
      });
    }
    return {
      code: 200,
      msg: 'success',
      data: await this.post.setPostReady(id, ready),
    };
  }

  @NeedPermission('post.state.publish')
  @UseGuards(AuthGuard)
  @Get(':id/publish')
  async setPostPublishTrue(
    @Param('id') id: number,
    @Query('state') publish: boolean,
  ): Promise<ResponseDto<any>> {
    id = Number(id);
    publish = true ? String(publish) === 'true' : false;
    return {
      code: 200,
      msg: 'success',
      data: await this.post.setPostPublish(id, publish),
    };
  }
}
