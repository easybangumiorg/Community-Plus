import {
  Body,
  Controller,
  Get,
  MethodNotAllowedException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { ParsemethodService } from './parsemethod.service';
import { checkPermission, NeedPermission } from 'src/shared';
import { SiteState } from '@prisma/client';
import { CreatePraseMethodDto } from './dto/create-prase.dto';
import { UpdatePraseMethodDto } from './dto/update-prase.dto';

@Controller('parsemethod')
export class ParsemethodController {
  constructor(private readonly parsemethod: ParsemethodService) {}

  @NeedPermission('parse_method.self')
  @Post('create')
  async createParseMethod(
    @Request() { user },
    @Body() body: CreatePraseMethodDto,
  ) {
    return {
      statusCode: 201,
      message: '创建解析方法成功',
      data: await this.parsemethod.createParseMethod(user.id, body),
    };
  }

  @NeedPermission('parse_method.self')
  @Post(':id/update')
  async updateParseMethod(
    @Param('id', ParseIntPipe) id: number,
    @Request() { user },
    @Body() body: UpdatePraseMethodDto,
  ) {
    const user_parsemethod = await this.parsemethod.findUserParseMethods(
      user.id,
      id,
    );
    if (!user_parsemethod && !checkPermission(user.role, 'parse_method.manage'))
      throw new NotFoundException({
        statusCode: 404,
        message: '找不到这个解析方法',
      });
    if (body.state && !checkPermission(user.role, 'parse_method.manage'))
      throw new MethodNotAllowedException({
        statusCode: 405,
        message: '无法修改状态',
      });
    return {
      statusCode: 200,
      message: '更新解析方法成功',
      data: await this.parsemethod.updateParseMethod(id, body),
    };
  }

  @NeedPermission('parse_method.self')
  @Post(':id/delete')
  async deleteParseMethod(
    @Param('id', ParseIntPipe) id: number,
    @Request() { user },
  ) {
    const user_parsemethod = await this.parsemethod.findUserParseMethods(
      user.id,
      id,
    );
    if (!user_parsemethod && !checkPermission(user.role, 'parse_method.manage'))
      throw new NotFoundException({
        statusCode: 404,
        message: '找不到这个解析方法',
      });
    return {
      statusCode: 200,
      message: '删除解析方法成功',
      data: await this.parsemethod.deleteParseMethod(id),
    };
  }

  @NeedPermission('resource.public')
  @Get(':id/info')
  async getParseMethod(
    @Param('id', ParseIntPipe) id: number,
    @Request() { user },
  ) {
    const data = await this.parsemethod.getParseMethod(id);
    if (
      !data ||
      (!(data.author.id === user.id || data.state === SiteState.PUBLISHED) &&
        !checkPermission(user.role, 'resource.all'))
    )
      throw new NotFoundException({
        statusCode: 404,
        message: '找不到这个解析方法',
      });
    return {
      statusCode: 200,
      message: '获取信息成功',
      data,
    };
  }

  @NeedPermission('resource.public')
  @Get('list')
  async listParseMethods(
    @Request() { user },
    @Query('page', ParseIntPipe) page,
    @Query('size', ParseIntPipe) size,
  ) {
    const where = {};
    if (!checkPermission(user.role, 'resource.all'))
      where['OR'] = [{ authorId: user.id }, { state: SiteState.PUBLISHED }];
    const data = await this.parsemethod.listParseMethods(page, size);
    return {
      statusCode: 200,
      message: '列出解析方法成功',
      data,
    };
  }

  @NeedPermission('resource.public')
  @Post('list')
  async listParseMethodsPost(
    @Request() { user },
    @Query('page', ParseIntPipe) page,
    @Query('size', ParseIntPipe) size,
    @Body() select: any,
  ) {
    if (!checkPermission(user.role, 'resource.all')) {
      // 这种限制并不是最佳实践，以后考虑优化
      if (select.authorId && select.authorId !== user.id)
        throw new NotFoundException({
          statusCode: 404,
          message: '只能查看自己的合集',
        });
      if (select.state && select.state !== SiteState.PUBLISHED)
        throw new NotFoundException({
          statusCode: 404,
          message: '只能查看已发布的合集',
        });
      if (select.OR)
        select.OR = [{ authorId: user.id }, { state: SiteState.PUBLISHED }];
    }
    const data = await this.parsemethod.listParseMethods(page, size, select);
    return {
      statusCode: 200,
      message: '列出解析方法成功',
      data,
    };
  }
}
