import { Module } from '@nestjs/common';
import { HelpController } from './help.controller';
import { HelpService } from './help.service';
import { HelpDto } from './dto/help.dto';

@Module({
  controllers: [HelpController],
  providers: [HelpService, HelpDto]
})
export class HelpModule {}
