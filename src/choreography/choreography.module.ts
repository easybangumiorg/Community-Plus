import { Module } from '@nestjs/common';
import { ChoreographyService } from './choreography.service';
import { ChoreographyController } from './choreography.controller';

@Module({
  providers: [ChoreographyService],
  controllers: [ChoreographyController],
})
export class ChoreographyModule {}
