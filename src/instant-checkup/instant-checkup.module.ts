import { Module } from '@nestjs/common';
import { InstantCheckupService } from './instant-checkup.service';
import { InstantCheckupController } from './instant-checkup.controller';
import { InstantCheckupDto } from './dto/instant-checkup.dto';

@Module({
  providers: [InstantCheckupService, InstantCheckupDto],
  controllers: [InstantCheckupController]
})
export class InstantCheckupModule {}
