import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ChoreographyService } from './choreography.service';
import { NeedPermission } from 'src/shared';

@Controller('choreography')
export class ChoreographyController {
  constructor(private readonly choreography: ChoreographyService) {}

  @NeedPermission('resource.public')
  @Get('list')
  async listChoreographies() {
    const data = await this.choreography.listChoreographies();
    return {
      statusCode: 200,
      message: 'Success',
      data,
    };
  }

  @NeedPermission('choreography.manage')
  @Get('create')
  async createChoreography(@Query('title') title: string) {
    const data = await this.choreography.createChoreography(title);
    return {
      statusCode: 200,
      message: 'Success',
      data,
    };
  }

  @NeedPermission('resource.public')
  @Get(':id/info')
  async getChoreography(@Param('id', ParseIntPipe) id: number) {
    const data = await this.choreography.getChoreography(id);
    if (!data)
      throw new NotFoundException({
        statusCode: 404,
        message: '未找到这个编排',
      });
    return {
      statusCode: 200,
      message: 'Success',
      data,
    };
  }

  @NeedPermission('choreography.manage')
  @Get(':id/set')
  async setChoreographyWeight(
    @Param('id', ParseIntPipe) id: number,
    @Query('weight', ParseIntPipe) weight: number,
  ) {
    const data = await this.choreography.setChoreographyWeight(id, weight);
    return {
      statusCode: 200,
      message: 'Success',
      data,
    };
  }

  @NeedPermission('choreography.manage')
  @Get(':id/delete')
  async deleteChoreography(@Param('id', ParseIntPipe) id: number) {
    const data = await this.choreography.deleteChoreography(id);
    return {
      statusCode: 200,
      message: 'Success',
      data,
    };
  }

  @NeedPermission('choreography.manage')
  @Get(':id/add')
  async addChoreographyItem(
    @Param('id', ParseIntPipe) id: number,
    @Query('collectionId') collection: number,
    @Query('title', ParseIntPipe) title: string,
  ) {
    const data = await this.choreography.addChoreographyItem(
      id,
      collection,
      title,
    );
    return {
      statusCode: 200,
      message: 'Success',
      data,
    };
  }

  @NeedPermission('choreography.manage')
  @Get('item/remove')
  async removeChoreographyItem(
    @Param('id', ParseIntPipe) id: number,
    @Query('itemId', ParseIntPipe) itemId: number,
  ) {
    const data = await this.choreography.removeChoreographyItem(itemId);
    return {
      statusCode: 200,
      message: 'Success',
      data,
    };
  }

  @NeedPermission('choreography.manage')
  @Get('item/set')
  async setChoreographyItemWeight(
    @Query('itemId', ParseIntPipe) itemId: number,
    @Query('weight', ParseIntPipe) weight: number,
  ) {
    const data = await this.choreography.setChoreographyItemWeight(
      itemId,
      weight,
    );
    return {
      statusCode: 200,
      message: 'Success',
      data,
    };
  }
}
