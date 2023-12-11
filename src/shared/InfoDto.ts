export class VersionInfoDto {
  version: string;
  apiVersion: number;
  apiName: string;
}

export class RootInfoDto {
  code: number;
  msg: string;
  data: VersionInfoDto;
}
