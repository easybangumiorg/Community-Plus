import { Injectable } from '@nestjs/common';
import { VersionInfoDto, AppConfig } from './shared';

@Injectable()
export class AppService {
  getVersion(): VersionInfoDto {
    return {
      version: '1.2.1',
      apiVersion: 0,
      apiName: 'easyBangumi-extension-plus',
    };
  }

  getHello(): string {
    return '纯纯看番社区API';
  }

  getConfig(): AppConfig {
    return {
      maxPageSize: 50,
      defaultPageSize: 20,
    };
  }
}
