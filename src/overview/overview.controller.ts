import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { OverviewService } from './overview.service';
import { NeedPermission, ResponseDto } from 'src/shared';
import { AuthGuard } from 'src/user/auth.guard';

@Controller('overview')
export class OverviewController {
  constructor(
    private readonly overview: OverviewService,
    // eslint-disable-next-line prettier/prettier
  ) { }

  @NeedPermission('overview.basic')
  @UseGuards(AuthGuard)
  @Get('/')
  async getOverview(): Promise<ResponseDto<any>> {
    return {
      code: 200,
      msg: 'success',
      data: await this.overview.getOverview(),
    };
  }

  @NeedPermission('overview.user')
  @UseGuards(AuthGuard)
  @Get('/user')
  async getUserOverview(@Request() { user }): Promise<ResponseDto<any>> {
    return {
      code: 200,
      msg: 'success',
      data: await this.overview.getUserOverview(user.id),
    };
  }
}
