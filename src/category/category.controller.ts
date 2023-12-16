import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { NeedPermission, ResponseDto } from 'src/shared';
import { AuthGuard } from 'src/user/auth.guard';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @NeedPermission('category.list')
  @UseGuards(AuthGuard)
  @Get('getAll')
  async getAllCategory(): Promise<ResponseDto<any>> {
    return {
      code: 200,
      msg: 'success',
      data: await this.categoryService.getAllCategory(),
    };
  }

  @NeedPermission('category.add')
  @UseGuards(AuthGuard)
  @Get('new')
  async addCategory(@Query('name') name: string): Promise<ResponseDto<any>> {
    return {
      code: 200,
      msg: 'success',
      data: await this.categoryService.addCategory(name),
    };
  }

  @NeedPermission('category.edit')
  @UseGuards(AuthGuard)
  @Post(':id')
  async editCategory(
    @Param('id') id: number,
    @Query('name') name: string,
  ): Promise<ResponseDto<any>> {
    id = Number(id);
    return {
      code: 200,
      msg: 'success',
      data: await this.categoryService.editCategory(id, name),
    };
  }

  @NeedPermission('category.delete')
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteCategory(@Param('id') id: number): Promise<ResponseDto<any>> {
    id = Number(id);
    const count = await this.categoryService.sumPostByCategoryId(1);
    if (count !== 0) {
      return {
        code: 400,
        msg: 'Category is not empty',
        data: {
          count,
        },
      };
    }
    return {
      code: 200,
      msg: 'success',
      data: await this.categoryService.deleteCategory(id),
    };
  }

  @NeedPermission('category.get')
  @UseGuards(AuthGuard)
  @Get(':id')
  async getCategory(@Param('id') id: number): Promise<ResponseDto<any>> {
    id = Number(id);
    return {
      code: 200,
      msg: 'success',
      data: await this.categoryService.getCategoryById(id),
    };
  }

  @NeedPermission('category.get.posts')
  @UseGuards(AuthGuard)
  @Get(':id/posts')
  async getCategoryPostById(
    @Param('id') id: number,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('all') all: boolean = false,
  ): Promise<ResponseDto<any>> {
    id = Number(id);
    all = true ? String(all) === 'true' : false;
    return {
      code: 200,
      msg: 'success',
      data: await this.categoryService.getPostByCategoryId(
        id,
        page && Number(page),
        pageSize && Number(pageSize),
        all,
      ),
    };
  }
}
