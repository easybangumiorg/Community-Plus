import {
  Body,
  Controller,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Get,
  Request,
  ParseArrayPipe,
  MethodNotAllowedException,
} from '@nestjs/common';
import { CollectionService } from './collection.service';
import { checkPermission, NeedPermission } from 'src/shared';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { SiteState } from '@prisma/client';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Controller('collection')
export class CollectionController {
  constructor(private readonly collection: CollectionService) {}

  @NeedPermission('collection.self')
  @Post('create')
  async createCollection(
    @Request() { user },
    @Body() body: CreateCollectionDto,
  ) {
    const data = await this.collection.createCollection(user.id, body);
    return {
      statusCode: 200,
      message: '创建成功',
      data,
    };
  }

  @NeedPermission('collection.self')
  @Post(':id/delete')
  async deleteCollection(
    @Request() { user },
    @Param('id', ParseIntPipe) id: number,
  ) {
    const collection = await this.collection.getCollectionInfo(id);
    if (!collection)
      throw new NotFoundException({
        statusCode: 404,
        message: '无法找到该合集',
      });
    if (
      collection.author.id !== user.id &&
      !checkPermission(user.role, 'collection.manage')
    )
      throw new MethodNotAllowedException({
        statusCode: 405,
        message: '无法删除其他用户创建的合集',
      });
    const data = await this.collection.deleteCollection(id);
    return {
      statusCode: 200,
      message: '删除成功',
      data,
    };
  }

  @NeedPermission('collection.self')
  @Post(':id/update')
  async updateCollection(
    @Request() { user },
    @Body() body: UpdateCollectionDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const collection = await this.collection.getCollectionInfo(id);
    if (!collection)
      throw new NotFoundException({
        statusCode: 404,
        message: '无法找到该合集',
      });
    if (
      collection.author.id !== user.id &&
      !checkPermission(user.role, 'collection.manage')
    )
      throw new MethodNotAllowedException({
        statusCode: 405,
        message: '无法修改其他用户创建的合集',
      });
    if (body.status && !checkPermission(user.role, 'collection.manage'))
      throw new MethodNotAllowedException({
        statusCode: 405,
        message: '无法修改合集状态',
      });
    const data = await this.collection.updateCollection(user.id, body);
    return {
      statusCode: 200,
      message: '更新成功',
      data,
    };
  }

  @NeedPermission('collection.self')
  @Get(':id/ready_pub')
  async readyPublishCollection(
    @Request() { user },
    @Param('id', ParseIntPipe) id: number,
  ) {
    const collection = await this.collection.getCollectionInfo(id);
    if (!collection)
      throw new NotFoundException({
        statusCode: 404,
        message: '无法找到该合集',
      });
    if (
      collection.author.id !== user.id &&
      !checkPermission(user.role, 'collection.manage')
    )
      throw new MethodNotAllowedException({
        statusCode: 405,
        message: '无法操作其他用户创建的合集',
      });
    const data = await this.collection.updateCollection(id, {
      status: SiteState.READY_PUB,
    });
    return {
      statusCode: 200,
      message: '操作成功',
      data,
    };
  }

  @NeedPermission('collection.self')
  @Post(':id/add_posts')
  async addPostsToCollection(
    @Request() { user },
    @Param('id', ParseIntPipe) id: number,
    @Body('posts', ParseArrayPipe) posts: number[],
  ) {
    const collection = await this.collection.getCollectionInfo(id);
    if (!collection)
      throw new NotFoundException({
        statusCode: 404,
        message: '无法找到该合集',
      });
    const user_can_manage_collection = checkPermission(
      user.role,
      'collection.manage',
    );
    if (collection.author.id !== user.id && !user_can_manage_collection)
      throw new MethodNotAllowedException({
        statusCode: 405,
        message: '不能向其他用户创建的合集添加内容',
      });
    if (user_can_manage_collection) {
      const collection = await this.collection.addItemsToCollection(id, posts);
      return {
        statusCode: 200,
        message: '添加成功',
        data: collection,
      };
    } else {
      const post_infos = await this.collection.getPostInfosByIDs(posts);
      // 不具备管理合集权限的用户，只能将公开或是自己的内容添加到合集
      const valid_posts = post_infos.filter(
        post => post.authorId === user.id || post.state === SiteState.PUBLISHED,
      );
      if (valid_posts.length === 0)
        throw new MethodNotAllowedException({
          statusCode: 405,
          message: '没有有效的内容可以添加到合集',
        });
      const collection = await this.collection.addItemsToCollection(
        id,
        valid_posts.map(post => post.id),
      );
      return {
        statusCode: 200,
        message: '添加成功',
        data: collection,
      };
    }
  }

  @NeedPermission('collection.self')
  @Post(':id/remove_posts')
  async removePostsFromCollection(
    @Request() { user },
    @Param('id', ParseIntPipe) id: number,
    @Body('posts', ParseArrayPipe) posts: number[],
  ) {
    const collection = await this.collection.getCollectionInfo(id);
    if (!collection)
      throw new NotFoundException({
        statusCode: 404,
        message: '无法找到该合集',
      });
    if (
      collection.author.id !== user.id &&
      !checkPermission(user.role, 'collection.manage')
    )
      throw new MethodNotAllowedException({
        statusCode: 405,
        message: '不能删除其他用户创建的合集',
      });
    const data = await this.collection.removeItemsFromCollection(id, posts);
    return {
      statusCode: 200,
      message: '移除成功',
      data,
    };
  }

  @NeedPermission('resource.public')
  @Get(':id/info')
  async getCollectionInfo(
    @Param('id', ParseIntPipe) id: number,
    @Request() { user },
  ) {
    const collection = await this.collection.getCollectionInfo(id);
    if (!collection)
      throw new NotFoundException({
        statusCode: 404,
        message: '无法找到该合集',
      });
    if (
      !(
        collection.author.id === user.id ||
        collection.state === SiteState.PUBLISHED
      ) &&
      !checkPermission(user.role, 'resource.all')
    )
      throw new MethodNotAllowedException({
        statusCode: 405,
        message: '无法获取非自己创建且非公开合集的信息',
      });
    return {
      statusCode: 200,
      message: '获取成功',
      data: collection,
    };
  }

  @NeedPermission('resource.public')
  @Get('list')
  async getCollectionList(
    @Request() { user },
    @Param('page', ParseIntPipe) page: number,
    @Param('size', ParseIntPipe) size: number,
  ) {
    const where = {};
    if (!checkPermission(user.role, 'resource.all'))
      where['OR'] = [{ authorId: user.id }, { state: SiteState.PUBLISHED }];
    const data = await this.collection.getCollectionList(page, size, where);
    return {
      statusCode: 200,
      message: '获取成功',
      data,
    };
  }

  @NeedPermission('resource.public')
  @Post('list')
  async getCollectionListWithSelect(
    @Request() { user },
    @Param('page', ParseIntPipe) page: number,
    @Param('size', ParseIntPipe) size: number,
    @Body() select: any,
  ) {
    //! 这种限制并不是最佳实践，以后考虑优化
    if (!checkPermission(user.role, 'resource.all'))
      select['OR'] = [{ authorId: user.id }, { state: SiteState.PUBLISHED }];
    const data = await this.collection.getCollectionList(page, size, select);
    return {
      statusCode: 200,
      message: '获取成功',
      data,
    };
  }

  @NeedPermission('resource.public')
  @Get(':id/posts')
  async getPostsByCollectionId(
    @Request() { user },
    @Param('id', ParseIntPipe) id: number,
    @Param('page', ParseIntPipe) page: number,
    @Param('size', ParseIntPipe) size: number,
  ) {
    const collection = await this.collection.getCollectionInfo(id);
    if (!collection)
      throw new NotFoundException({
        statusCode: 404,
        message: '无法找到该合集',
      });
    // 如果没有合集管理权限，用户只能查看自己和公开的合集中的内容
    if (
      !(
        collection.author.id === user.id ||
        collection.state === SiteState.PUBLISHED
      ) &&
      !checkPermission(user.role, 'resource.all')
    )
      throw new MethodNotAllowedException({
        statusCode: 405,
        message: '无法查看非自己创建且非公开的合集内容',
      });
    // 公开合集中存在未发布的内容，用户也可以查看
    const data = await this.collection.listCollectionItemsByID(id, page, size);
    return {
      statusCode: 200,
      message: '获取成功',
      data,
    };
  }

  @NeedPermission('resource.public')
  @Post(':id/posts')
  async getPostsWithSelectByCollectionId(
    @Request() { user },
    @Param('id', ParseIntPipe) id: number,
    @Param('page', ParseIntPipe) page: number,
    @Param('size', ParseIntPipe) size: number,
    @Body() select: any,
  ) {
    const collection = await this.collection.getCollectionInfo(id);
    if (!collection)
      throw new NotFoundException({
        statusCode: 404,
        message: '无法找到该合集',
      });
    // 如果没有合集管理权限，用户只能查看自己和公开的合集中的内容
    if (
      !(
        collection.author.id === user.id ||
        collection.state === SiteState.PUBLISHED
      ) &&
      !checkPermission(user.role, 'resource.all')
    )
      throw new MethodNotAllowedException({
        statusCode: 405,
        message: '无法查看非自己创建且非公开的合集内容',
      });
    // 公开合集中存在未发布的内容，用户也可以查看
    const data = await this.collection.listCollectionItemsByID(
      id,
      page,
      size,
      select,
    );
    return {
      statusCode: 200,
      message: '获取成功',
      data,
    };
  }
}
