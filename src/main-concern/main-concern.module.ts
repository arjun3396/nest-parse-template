import { Module } from '@nestjs/common';
import { MainConcernController } from './main-concern.controller';
import { MainConcernService } from './main-concern.service';
import { UtilsModule } from '../utils/utils.module';

@Module({
  controllers: [MainConcernController],
  providers: [MainConcernService],
  imports: [
    UtilsModule
  ],
  exports: [MainConcernService]
})
export class MainConcernModule {}
