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
import { userSignInReqDto, userSignInDto } from './dto/userSignDto';
import { AuthService } from './auth.service';
import { NeedPermission, ResponseDto } from 'src/shared';
import { AuthGuard } from './auth.guard';
import { UserService } from './user.service';
import { UserInfo, userInfoDto, userProfileDto } from './dto/userInfoDto';

@Controller('user')
export class UserController {
  constructor(
    private readonly auth: AuthService,
    private readonly user: UserService,
    // eslint-disable-next-line prettier/prettier
  ) { }

  @Post('signin')
  async signin(
    @Body() { account, passwd }: userSignInReqDto,
  ): Promise<ResponseDto<userSignInDto>> {
    return {
      code: 200,
      msg: 'success',
      data: await this.auth.signIn(account, passwd),
    };
  }

  @NeedPermission('user.profile')
  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Request() { user }): Promise<ResponseDto<userProfileDto>> {
    return {
      code: 200,
      msg: 'success',
      data: await this.user.getUserProfileByID(user.id),
    };
  }

  @NeedPermission('user.profile.edit')
  @UseGuards(AuthGuard)
  @Post('profile')
  async editProfile(
    @Request() { user },
    @Body() { name, bio, avatar }: userProfileDto,
  ): Promise<ResponseDto<userProfileDto>> {
    return {
      code: 200,
      msg: 'success',
      data: await this.user.editUserProfileByID(user.id, name, bio, avatar),
    };
  }

  @NeedPermission('user.list')
  @UseGuards(AuthGuard)
  @Get('list')
  async getUserList(
    @Query('page') page: number = 0,
    @Query('pageSize') pageSize: number = 10,
  ): Promise<ResponseDto<userProfileDto[]>> {
    page = Number(page);
    pageSize = Number(pageSize);
    if (page < 0 || pageSize <= 0)
      throw new ForbiddenException({
        code: 403,
        msg: 'Invalid page or pageSize',
      });
    return {
      code: 200,
      msg: 'success',
      data: await this.user.getUserList(page, pageSize),
    };
  }

  @NeedPermission('user.new')
  @UseGuards(AuthGuard)
  @Post('new')
  async newUser(
    @Body() { account, passwd }: userSignInReqDto,
  ): Promise<ResponseDto<userInfoDto>> {
    return {
      code: 200,
      msg: 'success',
      data: await this.user.signUpUser(account, passwd),
    };
  }

  @NeedPermission('user.passwd.reset')
  @UseGuards(AuthGuard)
  @Post('chpasswd')
  async changePasswd(
    @Request() { user },
    @Body() { oldPasswd, newPasswd },
  ): Promise<ResponseDto<userProfileDto>> {
    if (oldPasswd === newPasswd)
      throw new ForbiddenException({
        code: 401,
        msg: 'Invalid new password',
      });
    return {
      code: 200,
      msg: 'success',
      data: await this.auth.changePassword(user.id, oldPasswd, newPasswd),
    };
  }

  @NeedPermission('user.delete')
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<ResponseDto<any>> {
    id = Number(id);
    if (id === 1)
      throw new ForbiddenException({
        code: 403,
        msg: 'Cannot delete root user',
      });
    const col = await this.user.sumUserCollections(id);
    const pos = await this.user.sumUserPosts(id);
    console.log(col, pos);
    if (col + pos > 0)
      throw new ForbiddenException({
        code: 403,
        msg: 'User is not empty',
        data: {
          collection_count: col,
          post_count: pos,
        },
      });
    return {
      code: 200,
      msg: 'success',
      data: await this.user.deleteUserByID(id),
    };
  }

  @NeedPermission('user.modify')
  @UseGuards(AuthGuard)
  @Post(':id')
  async editUser(
    @Param('id') id: number,
    @Body() userInfo: UserInfo,
  ): Promise<ResponseDto<userProfileDto>> {
    id = Number(id);
    return {
      code: 200,
      msg: 'success',
      data: await this.user.editUserByID(id, userInfo),
    };
  }

  @NeedPermission('user.get')
  @UseGuards(AuthGuard)
  @Get(':id')
  async getUser(@Param('id') id: number): Promise<ResponseDto<userInfoDto>> {
    id = Number(id);
    return {
      code: 200,
      msg: 'success',
      data: await this.user.getUserByID(id),
    };
  }
}
