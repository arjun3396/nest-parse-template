import { Module } from '@nestjs/common';
import { TreeController } from './tree.controller';
import { TreeService } from './tree.service';
import { UtilsModule } from '../utils/utils.module';

@Module({
  controllers: [TreeController],
  providers: [TreeService],
  imports: [
    UtilsModule
  ]
})
export class TreeModule {}
