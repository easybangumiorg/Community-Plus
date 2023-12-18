import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CollectionService } from './collection.service';
import { NeedPermission, ResponseDto, checkPermission } from 'src/shared';
import { AuthGuard } from 'src/user/auth.guard';
import { createCollectionDto, editCollectionDto } from './dto/collectionDto';
import { $Enums } from '@prisma/client';

@Controller('collection')
export class CollectionController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly collection: CollectionService) { }

  @NeedPermission('collection.list')
  @UseGuards(AuthGuard)
  @Post('list')
  async listCollection(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Body() query: any,
  ): Promise<ResponseDto<any>> {
    return {
      code: 200,
      msg: 'success',
      data: await this.collection.listCollection(
        page && Number(page),
        pageSize && Number(pageSize),
        query,
      ),
    };
  }

  @NeedPermission('collection.get')
  @UseGuards(AuthGuard)
  @Get(':id')
  async getCollection(
    @Param('id') id: number,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ): Promise<ResponseDto<any>> {
    id = Number(id);
    return {
      code: 200,
      msg: 'success',
      data: await this.collection.getCollection(
        id,
        page && Number(page),
        pageSize && Number(pageSize),
      ),
    };
  }

  @NeedPermission('collection.add')
  @UseGuards(AuthGuard)
  @Post('add')
  async createCollection(
    @Body() collection: createCollectionDto,
    @Request() { user },
  ): Promise<ResponseDto<any>> {
    return {
      code: 200,
      msg: 'success',
      data: await this.collection.createCollection(user.id, collection),
    };
  }

  @NeedPermission('collection.update')
  @UseGuards(AuthGuard)
  @Post(':id')
  async editCollection(
    @Param('id') id: number,
    @Body() collection: editCollectionDto,
    @Request() { user },
  ): Promise<ResponseDto<any>> {
    id = Number(id);
    if (
      !(await this.collection.checkCollectionIsUser(id, user.id)) &&
      !checkPermission(user.rol, 'collection.update.overuser')
    ) {
      throw new ForbiddenException({
        code: 403,
        msg: 'Permission denied',
      });
    }
    return {
      code: 200,
      msg: 'success',
      data: await this.collection.editCollection(id, collection),
    };
  }

  @NeedPermission('collection.delete')
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteCollection(
    @Param('id') id: number,
    @Request() { user },
  ): Promise<ResponseDto<any>> {
    id = Number(id);
    const count = await this.collection.sumPostInCollection(id);
    if (count > 0) {
      throw new ForbiddenException({
        code: 403,
        msg: 'There are posts that is referenced by the collection',
      });
    }
    if (
      !(await this.collection.checkCollectionIsUser(id, user.id)) &&
      !checkPermission(user.rol, 'collection.delete.overuser')
    ) {
      throw new ForbiddenException({
        code: 403,
        msg: 'Permission denied',
      });
    }
    return {
      code: 200,
      msg: 'success',
      data: await this.collection.deleteCollection(id),
    };
  }

  @NeedPermission('collection.append')
  @UseGuards(AuthGuard)
  @Get(':id/append')
  async appendPost(
    @Param('id') id: number,
    @Query('pid') pid: number,
    @Request() { user },
  ): Promise<ResponseDto<any>> {
    id = Number(id);
    pid = Number(pid);
    if (
      !(await this.collection.checkCollectionIsUser(id, user.id)) &&
      !checkPermission(user.rol, 'collection.append.overuser')
    ) {
      throw new ForbiddenException({
        code: 403,
        msg: 'Permission denied',
      });
    }
    return {
      code: 200,
      msg: 'success',
      data: await this.collection.appendPost(id, pid),
    };
  }

  @NeedPermission('collection.remove')
  @UseGuards(AuthGuard)
  @Get(':id/remove')
  async removePost(
    @Param('id') id: number,
    @Query('pid') pid: number,
    @Request() { user },
  ): Promise<ResponseDto<any>> {
    id = Number(id);
    pid = Number(pid);
    if (
      !(await this.collection.checkCollectionIsUser(id, user.id)) &&
      !checkPermission(user.rol, 'collection.remove.overuser')
    ) {
      throw new ForbiddenException({
        code: 403,
        msg: 'Permission denied',
      });
    }
    return {
      code: 200,
      msg: 'success',
      data: await this.collection.removePost(id, pid),
    };
  }

  @NeedPermission('collection.state')
  @UseGuards(AuthGuard)
  @Get(':id/state')
  async setState(
    @Param('id') id: number,
    @Query('state') state: $Enums.CollectionState,
  ): Promise<ResponseDto<any>> {
    id = Number(id);
    return {
      code: 200,
      msg: 'success',
      data: await this.collection.setState(id, state),
    };
  }
}
