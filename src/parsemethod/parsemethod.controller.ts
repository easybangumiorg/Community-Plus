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
      statusCode: 200,
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
    const parsemethod = await this.parsemethod.getParseMethod(id);
    if (!parsemethod)
      throw new NotFoundException({
        statusCode: 404,
        message: '找不到该解析方法',
      });
    if (
      parsemethod.author.id !== user.id &&
      !checkPermission(user.role, 'parse_method.manage')
    )
      throw new MethodNotAllowedException({
        statusCode: 405,
        message: '不能修改其他用户创建的解析方法',
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
    const parsemethod = await this.parsemethod.getParseMethod(id);
    if (!parsemethod)
      throw new NotFoundException({
        statusCode: 404,
        message: '找不到该解析方法',
      });
    if (
      parsemethod.author.id !== user.id &&
      !checkPermission(user.role, 'parse_method.manage')
    )
      throw new MethodNotAllowedException({
        statusCode: 405,
        message: '不能删除其他用户创建的解析方法',
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
    if (!data)
      throw new NotFoundException({
        statusCode: 404,
        message: '找不到该解析方法',
      });
    if (
      !(data.author.id === user.id || data.state === SiteState.PUBLISHED) &&
      !checkPermission(user.role, 'resource.all')
    )
      throw new NotFoundException({
        statusCode: 404,
        message: '找不到或是无法访问这个解析方法',
      });
    return {
      statusCode: 200,
      message: '获取信息成功',
      data,
    };
  }

  @NeedPermission('paese_method.self')
  @Get(':id/ready_pub')
  async readyPublishParseMethod(
    @Param('id', ParseIntPipe) id: number,
    @Request() { user },
  ) {
    const parsemethod = await this.parsemethod.getParseMethod(id);
    if (!parsemethod)
      throw new NotFoundException({
        statusCode: 404,
        message: '找不到该解析方法',
      });
    if (parsemethod.author.id !== user.id)
      throw new MethodNotAllowedException({
        statusCode: 405,
        message: '不能预发布其他用户创建的解析方法',
      });
    return {
      statusCode: 200,
      message: '准备发布解析方法成功',
      data: await this.parsemethod.updateParseMethod(id, {
        state: SiteState.READY_PUB,
      }),
    };
  }

  @NeedPermission('resource.public')
  @Get('list')
  async listParseMethods(
    @Request() { user },
    @Query('page', ParseIntPipe) page: number,
    @Query('size', ParseIntPipe) size: number,
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
    // 这种限制并不是最佳实践，以后考虑优化
    if (!checkPermission(user.role, 'resource.all'))
      select['OR'] = [{ authorId: user.id }, { state: SiteState.PUBLISHED }];
    const data = await this.parsemethod.listParseMethods(page, size, select);
    return {
      statusCode: 200,
      message: '列出解析方法成功',
      data,
    };
  }
}
