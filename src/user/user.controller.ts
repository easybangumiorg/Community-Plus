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
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload, NeedPermission, Role } from 'src/shared';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly user: UserService,
    private readonly jwt: JwtService,
  ) {}

  @Post('login')
  async login(@Body() { email, password }: LoginDto) {
    const data = await this.user.getLoginUser(email, password);
    if (!data)
      throw new UnauthorizedException({
        statusCode: 401,
        message: '错误的用户名或密码',
      });
    if (data.role === Role.BLOCKED)
      throw new MethodNotAllowedException({
        statusCode: 405,
        message: '用户已被封禁',
      });
    const payload: JwtPayload = {
      id: data.id,
      eml: data.email,
      rol: data.role,
      rc: 0,
    };
    const token = await this.jwt.signAsync(payload);
    return {
      statusCode: 200,
      message: '登录成功',
      data,
      token,
    };
  }

  @NeedPermission('user.self')
  @Get('referesh-token')
  async refreshToken(@Request() { user }) {
    if (user.rc > 5)
      throw new MethodNotAllowedException({
        statusCode: 405,
        message: '令牌刷新次数过多，请重新登录',
      });
    const payload: JwtPayload = {
      id: user.id,
      eml: user.email,
      rol: user.role,
      rc: user.rc + 1,
    };
    const token = await this.jwt.signAsync(payload);
    return {
      statusCode: 200,
      message: '令牌刷新成功',
      token,
    };
  }

  @NeedPermission('user.self')
  @Get('profile')
  async getProfile(@Request() { user }) {
    const data = await this.user.getProfileByID(user.id);
    return {
      statusCode: 200,
      message: '获取用户信息成功',
      data,
    };
  }

  @NeedPermission('user.self')
  @Post('profile')
  async updateProfile(@Request() { user }, @Body() body: UpdateProfileDto) {
    const data = await this.user.updateProfileByID(user.id, body);
    return {
      statusCode: 200,
      message: '用户信息更新成功',
      data,
    };
  }

  @NeedPermission('user.self')
  @Post('change-password')
  async changePassword(
    @Request() { user },
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
  ) {
    const selectedUser = await this.user.getPasswdUserByID(
      user.id,
      oldPassword,
    );
    if (!selectedUser) {
      throw new NotFoundException({
        statusCode: 404,
        message: '错误的密码',
      });
    }
    if (oldPassword === newPassword) {
      throw new MethodNotAllowedException({
        statusCode: 405,
        message: '新旧密码不能相同',
      });
    }
    const data = await this.user.updateProfileByID(user.id, {
      password: newPassword,
    });
    return {
      statusCode: 200,
      message: '密码修改成功',
      data,
    };
  }

  @NeedPermission('user.manage')
  @Get('list')
  async getUserList(
    @Query('page', ParseIntPipe) page: number = 0,
    @Query('size', ParseIntPipe) size: number = 20,
  ) {
    const data = await this.user.getUserList(page, size);
    return {
      statusCode: 200,
      message: '获取用户列表成功',
      data,
    };
  }

  @NeedPermission('user.manage')
  @Post('list')
  async selectUserList(
    @Query('page', ParseIntPipe) page: number = 0,
    @Query('size', ParseIntPipe) size: number = 20,
    @Body() body: any,
  ) {
    const data = await this.user.getUserList(page, size, body);
    return {
      statusCode: 200,
      message: '获取用户列表成功',
      data,
    };
  }

  @NeedPermission('user.manage')
  @Post('create')
  async createUser(@Body() body: CreateUserDto) {
    const data = await this.user.createUser(body);
    return {
      statusCode: 200,
      message: '用户创建成功',
      data,
    };
  }

  @NeedPermission('user.manage')
  @Get(':id/info')
  async getUserInfo(@Param('id', ParseIntPipe) id: number) {
    const data = await this.user.getProfileByID(id);
    return {
      statusCode: 200,
      message: '获取用户信息成功',
      data,
    };
  }

  @NeedPermission('user.manage')
  @Post(':id/info')
  async updateUserInfo(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ) {
    const data = await this.user.updateProfileByID(id, body);
    return {
      statusCode: 200,
      message: '用户信息更新成功',
      data,
    };
  }
}
