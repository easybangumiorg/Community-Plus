import { Injectable } from '@nestjs/common';
import { VersionInfoDto } from './shared';

@Injectable()
export class AppService {
  getVersion(): VersionInfoDto {
    return {
      version: '1.0.0',
      apiVersion: 1,
      apiName: 'easyBangumi-extension-plus',
    };
  }

  getHello(): string {
    return '纯纯看番社区资源站API';
  }
}
