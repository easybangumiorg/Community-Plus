import { $Enums } from '@prisma/client';

export class userProfileDto {
  name: string;
  bio: string;
  avatar: string;
}

export class userInfoDto {
  id: number;
  account: string;
  email: string;
  createdAt: Date;
  role: string;
  profile: userProfileDto;
}

export type UserInfo = {
  account?: string;
  email?: string;
  role?: $Enums.Role;
  name?: string;
  bio?: string;
  avatar?: string;
};
