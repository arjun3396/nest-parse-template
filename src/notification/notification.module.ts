import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { UtilsModule } from '../utils/utils.module';

@Module({
  providers: [NotificationService],
  controllers: [NotificationController],
  imports: [UtilsModule]
})
export class NotificationModule {}
