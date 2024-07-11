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
import { JwtPayload, NeedPermission } from 'src/shared';
import { JwtService } from '@nestjs/jwt';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  async login(@Body() { email, password }: LoginDto) {
    const data = await this.userService.getLoginUser(email, password);
    if (!data)
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'Invalid account or password',
      });
    const payload: JwtPayload = {
      id: data.id,
      eml: data.email,
      rol: data.role,
    };
    const token = await this.jwtService.signAsync(payload);
    return {
      statusCode: 200,
      message: 'Login success',
      data,
      token,
    };
  }

  @NeedPermission('user.self')
  @Get('profile')
  async getProfile(@Request() { user }) {
    const data = await this.userService.getProfile(user.id);
    return {
      statusCode: 200,
      message: 'Profile fetched',
      data,
    };
  }

  @NeedPermission('user.self')
  @Post('profile')
  async updateProfile(@Request() { user }, @Body() body: UpdateProfileDto) {
    const data = await this.userService.updateProfile(user.id, body);
    return {
      statusCode: 200,
      message: 'Profile updated',
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
    const selectedUser = await this.userService.getPasswdUserByID(
      user.id,
      oldPassword,
    );
    if (!selectedUser) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'User not found',
      });
    }
    if (oldPassword === newPassword) {
      throw new MethodNotAllowedException({
        statusCode: 405,
        message: 'Old and new password are the same',
      });
    }
    const data = await this.userService.updateProfile(user.id, {
      password: newPassword,
    });
    return {
      statusCode: 200,
      message: 'Password changed',
      data,
    };
  }

  @NeedPermission('user.manage')
  @Get('list')
  async getUserList(
    @Query('page', ParseIntPipe) page: number = 0,
    @Query('size', ParseIntPipe) size: number = 20,
  ) {
    const data = await this.userService.getList(page, size);
    return {
      statusCode: 200,
      message: 'User list fetched',
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
    const data = await this.userService.getList(page, size, body);
    return {
      statusCode: 200,
      message: 'User list fetched',
      data,
    };
  }

  @NeedPermission('user.manage')
  @Post('create')
  async createUser(@Body() body: CreateUserDto) {
    const data = await this.userService.create(body);
    return {
      statusCode: 200,
      message: 'User created',
      data,
    };
  }

  @NeedPermission('user.manage')
  @Get(':id/info')
  async getUserInfo(@Param('id', ParseIntPipe) id: number) {
    const data = await this.userService.getProfile(id);
    return {
      statusCode: 200,
      message: 'User info fetched',
      data,
    };
  }

  @NeedPermission('user.manage')
  @Post(':id/info')
  async updateUserInfo(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateUserDto,
  ) {
    const data = await this.userService.updateProfile(id, body);
    return {
      statusCode: 200,
      message: 'User info fetched',
      data,
    };
  }
}
