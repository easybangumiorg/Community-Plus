export class userProfileDto {
  name: string;
  bio: string;
  avatar: string;
}

export class userInfoDto {
  id: number;
  account: string;
  createdAt: Date;
  role: string;
  email: string;
  profile: userProfileDto;
}
