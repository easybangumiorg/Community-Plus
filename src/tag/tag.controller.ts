import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { checkPermission, NeedPermission } from 'src/shared';
import { SiteState } from '@prisma/client';

@Controller('tag')
export class TagController {
  constructor(private readonly tag: TagService) {}

  @NeedPermission('resource.public')
  @Get('/')
  async getTag(@Query('name') name: string) {
    return {
      statusCode: 200,
      message: '获取标签成功',
      data: await this.tag.getTag(name),
    };
  }

  @NeedPermission('tag.manage')
  @Get(':id/delete')
  async deleteTag(@Param(ParseIntPipe) id: number) {
    return {
      statusCode: 200,
      message: '删除标签成功',
      data: await this.tag.deleteTag(id),
    };
  }

  @NeedPermission('resource.public')
  @Get('list')
  async listTags(
    @Query('page', ParseIntPipe) page: number,
    @Query('size', ParseIntPipe) size: number,
  ) {
    return {
      statusCode: 200,
      message: '获取标签列表成功',
      data: await this.tag.listTags(page, size),
    };
  }

  @NeedPermission('resource.public')
  @Get(':id/posts')
  async listTagItems(
    @Request() { user },
    @Param('id', ParseIntPipe) tagId: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('size', ParseIntPipe) size: number,
  ) {
    const select: any = {};
    if (!checkPermission(user.role, 'resource.all'))
      select['OR'] = [{ authorId: user.id }, { state: SiteState.PUBLISHED }];
    const data = await this.tag.listTagItems(tagId, page, size, select);
    return {
      statusCode: 200,
      message: '获取标签下的文章成功',
      data,
    };
  }

  @NeedPermission('resource.public')
  @Post(':id/posts')
  async listTagItemsWithSelect(
    @Request() { user },
    @Param('id', ParseIntPipe) tagId: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('size', ParseIntPipe) size: number,
    @Body() select: any,
  ) {
    if (!checkPermission(user.role, 'resource.all')) {
      //! 这种限制并不是最佳实践，以后考虑优化
      if (select.authorId && select.authorId !== user.id)
        throw new NotFoundException({
          statusCode: 404,
          message: '只能查看自己的文章',
        });
      if (select.state && select.state !== SiteState.PUBLISHED)
        throw new NotFoundException({
          statusCode: 404,
          message: '只能查看已发布的文章',
        });
      if (select.OR)
        select.OR = [{ authorId: user.id }, { state: SiteState.PUBLISHED }];
    }
    const data = await this.tag.listTagItems(tagId, page, size, select);
    return {
      statusCode: 200,
      message: '获取标签下的文章成功',
      data,
    };
  }
}
