import { Module } from '@nestjs/common';
import { InstantCheckupService } from './instant-checkup.service';
import { InstantCheckupController } from './instant-checkup.controller';

@Module({
  providers: [InstantCheckupService],
  controllers: [InstantCheckupController]
})
export class InstantCheckupModule {}
