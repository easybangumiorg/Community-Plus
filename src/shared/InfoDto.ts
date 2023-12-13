export class ResponseDto<T> {
  code: number;
  msg: string;
  data?: T;
}

export class VersionInfoDto {
  version: string;
  apiVersion: number;
  apiName: string;
}
