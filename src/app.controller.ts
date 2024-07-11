import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ResponseDto, VersionInfoDto } from './shared';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getInfo(): ResponseDto<VersionInfoDto> {
    return {
      statusCode: 200,
      message: '纯纯看番社区API',
      data: this.appService.getVersion(),
    };
  }
}
