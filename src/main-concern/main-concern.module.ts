import { Module } from '@nestjs/common';
import { MainConcernController } from './main-concern.controller';
import { MainConcernService } from './main-concern.service';

@Module({
  controllers: [MainConcernController],
  providers: [MainConcernService]
})
export class MainConcernModule {}
