import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { userSignInReqDto, userSignInDto } from './dto/userSignDto';
import { AuthService } from './auth.service';
import { NeedPermission, ResponseDto } from 'src/shared';
import { AuthGuard } from './auth.guard';
import { UserService } from './user.service';
import { userProfileDto } from './dto/userInfoDto';

@Controller('user')
export class UserController {
  constructor(
    private readonly auth: AuthService,
    private readonly user: UserService,
  ) {}

  @Post('signin')
  async signin(
    @Body() { account, passwd }: userSignInReqDto,
  ): Promise<ResponseDto<userSignInDto>> {
    return {
      code: 200,
      msg: 'Sign in successfully',
      data: await this.auth.signIn(account, passwd),
    };
  }

  @NeedPermission('user.profile')
  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Request() { user }): Promise<ResponseDto<userProfileDto>> {
    return {
      code: 200,
      msg: 'Get profile successfully',
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
      msg: 'Edit profile successfully',
      data: await this.user.editUserProfileByID(user.id, name, bio, avatar),
    };
  }
}
