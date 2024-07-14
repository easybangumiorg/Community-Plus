import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ChoreographyService } from './choreography.service';
import { NeedPermission } from 'src/shared';

@Controller('choreography')
export class ChoreographyController {
  constructor(private readonly choreography: ChoreographyService) {}

  @NeedPermission('resource.public')
  @Get('list')
  async listChoreographies() {
    return {
      statusCode: 200,
      message: 'Success',
      data: await this.choreography.listChoreographies(),
    };
  }

  @NeedPermission('choreography.manage')
  @Get('create')
  async createChoreography(@Query('title') title: string) {
    return {
      statusCode: 200,
      message: 'Success',
      data: await this.choreography.createChoreography(title),
    };
  }

  @NeedPermission('resource.public')
  @Get(':id/info')
  async getChoreography(@Param('id', ParseIntPipe) id: number) {
    return {
      statusCode: 200,
      message: 'Success',
      data: await this.choreography.getChoreography(id),
    };
  }

  @NeedPermission('choreography.manage')
  @Get(':id/set')
  async setChoreographyWeight(
    @Param('id', ParseIntPipe) id: number,
    @Query('weight', ParseIntPipe) weight: number,
  ) {
    return {
      statusCode: 200,
      message: 'Success',
      data: await this.choreography.setChoreographyWeight(id, weight),
    };
  }

  @NeedPermission('choreography.manage')
  @Get(':id/delete')
  async deleteChoreography(@Param('id', ParseIntPipe) id: number) {
    return {
      statusCode: 200,
      message: 'Success',
      data: await this.choreography.deleteChoreography(id),
    };
  }

  @NeedPermission('choreography.manage')
  @Get(':id/add')
  async addChoreographyItem(
    @Param('id', ParseIntPipe) id: number,
    @Query('collectionId') collection: number,
    @Query('title', ParseIntPipe) title: string,
  ) {
    return {
      statusCode: 200,
      message: 'Success',
      data: await this.choreography.addChoreographyItem(id, collection, title),
    };
  }

  @NeedPermission('choreography.manage')
  @Get('item/remove')
  async removeChoreographyItem(
    @Param('id', ParseIntPipe) id: number,
    @Query('itemId', ParseIntPipe) itemId: number,
  ) {
    return {
      statusCode: 200,
      message: 'Success',
      data: await this.choreography.removeChoreographyItem(itemId),
    };
  }

  @NeedPermission('choreography.manage')
  @Get('item/set')
  async setChoreographyItemWeight(
    @Query('itemId', ParseIntPipe) itemId: number,
    @Query('weight', ParseIntPipe) weight: number,
  ) {
    return {
      statusCode: 200,
      message: 'Success',
      data: await this.choreography.setChoreographyItemWeight(itemId, weight),
    };
  }
}
