import { $Enums } from '@prisma/client';

export class createPostDto {
  cid: number;
  title: string;
  cover: string;
  summary: string;
  tags: string;
  postStatus: $Enums.PostStatus;
  status: string;
  nsfw: boolean;
}

export class editPostDto {
  cid?: number;
  title?: string;
  cover?: string;
  summary?: string;
  tags?: string;
  postStatus?: $Enums.PostStatus;
  status?: string;
  nsfw?: boolean;
}
