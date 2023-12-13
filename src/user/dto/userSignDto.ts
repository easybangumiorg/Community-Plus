import { userInfoDto } from './userInfoDto';

export class userSignInReqDto {
  account: string;
  passwd: string;
}

export class userSignInDto extends userInfoDto {
  token: string;
}
