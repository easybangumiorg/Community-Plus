import { Injectable } from '@nestjs/common';
import { VersionInfoDto, AppConfig } from './shared';

@Injectable()
export class AppService {
  getVersion(): VersionInfoDto {
    return {
      version: '1.2.1',
      apiVersion: 1,
      apiName: 'easyBangumi-extension-plus',
    };
  }

  getConfig(): AppConfig {
    return {
      maxPageSize: 50,
      defaultPageSize: 20,
    };
  }
}
