import {
  Body,
  Controller,
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
}
