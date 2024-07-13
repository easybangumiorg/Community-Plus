import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChoreographyService {
  constructor(private readonly prisma: PrismaService) {}

  async createChoreography(title: string) {
    return await this.prisma.choreography.create({
      data: {
        title,
        weight: 0,
      },
    });
  }

  async setChoreographyWeight(id: number, weight: number) {
    return await this.prisma.choreography.update({
      where: { id },
      data: { weight },
    });
  }

  async listChoreographies() {
    return await this.prisma.choreography.findMany();
  }

  async getChoreography(id: number) {
    return await this.prisma.choreography.findUnique({
      where: { id },
      select: {
        items: {
          select: {
            id: true,
            title: true,
            weight: true,
            collection: {
              select: {
                id: true,
                title: true,
                summary: true,
                cover: true,
                state: true,
                author: {
                  select: {
                    id: true,
                    name: true,
                    bio: true,
                    avatar: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async deleteChoreography(id: number) {
    return await this.prisma.choreography.delete({
      where: { id },
    });
  }

  async addChoreographyItem(
    choreographyId: number,
    collectionId: number,
    title: string,
  ) {
    return await this.prisma.choreographyItem.create({
      data: {
        choreographyId,
        collectionId,
        title,
        weight: 0,
      },
    });
  }

  async setChoreographyItemWeight(id: number, weight: number) {
    return await this.prisma.choreographyItem.update({
      where: { id },
      data: { weight },
    });
  }

  async removeChoreographyItem(id: number) {
    return await this.prisma.choreographyItem.delete({
      where: { id },
    });
  }
}
