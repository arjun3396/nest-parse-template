import { Module } from '@nestjs/common';
import { HelpController } from './help.controller';
import { HelpService } from './help.service';
import { HelpDto } from './dto/help.dto';
import { UtilsModule } from '../utils/utils.module';

@Module({
  controllers: [HelpController],
  providers: [HelpService, HelpDto],
  imports: [
    UtilsModule
  ]
})
export class HelpModule {}
