import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { checkPermission, NeedPermission } from 'src/shared';
import { CreateCategoryDto } from './dto/create-category.dto';
import { SiteState } from '@prisma/client';

@Controller('category')
export class CategoryController {
  constructor(private readonly category: CategoryService) {}

  @NeedPermission('resource.public')
  @Get('getAll')
  async getAllCategory() {
    const data = await this.category.getAllCategory();
    return {
      statusCode: 200,
      message: '获取所有分类成功',
      data,
    };
  }

  @NeedPermission('resource.public')
  @Get(':id/info')
  async getCategoryById(@Param(ParseIntPipe) { id }) {
    const data = await this.category.getCategoryById(id);
    return {
      statusCode: 200,
      message: '获取分类信息成功',
      data,
    };
  }

  @NeedPermission('resource.public')
  @Get(':id/posts')
  async getPostByCategoryId(
    @Request() { user },
    @Param(ParseIntPipe) { id },
    @Query('page', ParseIntPipe) page: number = 0,
    @Query('size', ParseIntPipe) size: number = 20,
  ) {
    const select: any = {};
    if (!checkPermission(user.role, 'category.manage')) {
      select.status = SiteState.PUBLISHED;
    }
    const data = await this.category.getPostByCategoryId(
      id,
      page,
      size,
      select,
    );
    return {
      statusCode: 200,
      message: '获取分类下的番剧成功',
      data,
    };
  }

  @NeedPermission('resource.public')
  @Get(':id/posts')
  async getPostWithSelectByCategoryId(
    @Request() { user },
    @Body() select: any,
    @Param(ParseIntPipe) { id },
    @Query('page', ParseIntPipe) page: number = 0,
    @Query('size', ParseIntPipe) size: number = 20,
  ) {
    if (!checkPermission(user.role, 'category.manage')) {
      select.status = SiteState.PUBLISHED;
    }
    const data = await this.category.getPostByCategoryId(
      id,
      page,
      size,
      select,
    );
    return {
      statusCode: 200,
      message: '获取分类下的番剧成功',
      data,
    };
  }

  @NeedPermission('category.manage')
  @Post(':id/delete')
  async deleteCategory(@Param(ParseIntPipe) { id }) {
    const res = await this.category.deleteCategory(id);
    return {
      statusCode: 200,
      message: '删除分类成功',
      data: res,
    };
  }

  @NeedPermission('category.manage')
  @Post(':id/update')
  async updateCategory(
    @Param(ParseIntPipe) { id },
    @Body() data: CreateCategoryDto,
  ) {
    const res = await this.category.updateCategory(id, data);
    return {
      statusCode: 200,
      message: '更新分类成功',
      data: res,
    };
  }

  @NeedPermission('category.manage')
  @Post('create')
  async createCategory(@Body() data: CreateCategoryDto) {
    const res = await this.category.createCategory(data);
    return {
      statusCode: 201,
      message: '创建分类成功',
      data: res,
    };
  }
}
