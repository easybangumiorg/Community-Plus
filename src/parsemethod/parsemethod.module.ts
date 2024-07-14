import { Module } from '@nestjs/common';
import { ParsemethodService } from './parsemethod.service';
import { ParsemethodController } from './parsemethod.controller';

@Module({
  providers: [ParsemethodService],
  controllers: [ParsemethodController],
})
export class ParsemethodModule {}
