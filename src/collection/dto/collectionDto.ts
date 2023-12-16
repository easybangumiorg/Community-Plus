import { $Enums } from '@prisma/client';

export class createCollectionDto {
  name: string;
  summary: string;
  cover: string;
}

export class editCollectionDto {
  name?: string;
  summary?: string;
  cover?: string;
  state?: $Enums.CollectionState;
}
