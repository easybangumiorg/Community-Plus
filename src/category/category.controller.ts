import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
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

  @NeedPermission('category.get')
  @UseGuards(AuthGuard)
  @Get(':id')
  async getCategoryById(
    @Param('id') id: number,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ): Promise<ResponseDto<any>> {
    id = Number(id);
    page = Number(page);
    pageSize = Number(pageSize);
    const category = await this.categoryService.getCategoryById(id);
    if (!category) {
      return {
        code: 400,
        msg: 'Invalid category id',
      };
    }
    return {
      code: 200,
      msg: 'success',
      data: await this.categoryService.getPostByCategoryId(id, page, pageSize),
    };
  }
}
