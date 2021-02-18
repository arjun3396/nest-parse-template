import { Module } from '@nestjs/common';
import { InstantCheckupService } from './instant-checkup.service';
import { InstantCheckupController } from './instant-checkup.controller';
import { InstantCheckupDto } from './dto/instant-checkup.dto';
import { UtilsModule } from '../utils/utils.module';
import { UserModule } from '../user/user.module';

@Module({
  providers: [InstantCheckupService, InstantCheckupDto],
  controllers: [InstantCheckupController],
  imports: [
    UtilsModule,
    UserModule,
  ]
})
export class InstantCheckupModule {}
