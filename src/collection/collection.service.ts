import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createCollectionDto, editCollectionDto } from './dto/collectionDto';

@Injectable()
export class CollectionService {
  constructor(private readonly prisma: PrismaService) {}

  createCollection(
    userId: number,
    { name, summary, cover }: createCollectionDto,
  ) {
    return this.prisma.collection.create({
      data: {
        name,
        summary,
        cover,
        userId: userId,
      },
    });
  }

  editCollection(
    id: number,
    { name, summary, cover, state }: editCollectionDto,
  ) {
    return this.prisma.collection.update({
      where: {
        id,
      },
      data: {
        name,
        summary,
        cover,
        state,
      },
    });
  }
}
