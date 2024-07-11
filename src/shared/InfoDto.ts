export class ResponseDto<T> {
  statusCode: number;
  message: string;
  error?: string;
  data?: T;
}

export class VersionInfoDto {
  version: string;
  apiVersion: number;
  apiName: string;
}
