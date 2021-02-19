import { Module } from '@nestjs/common';
import { ConsultationSessionService } from './consultation-session.service';
import { ConsultationSessionDto } from './dto/consultation-session.dto';
import { UtilsModule } from '../utils/utils.module';

@Module({
  providers: [ConsultationSessionService, ConsultationSessionDto],
  imports: [
    UtilsModule
  ]
})
export class ConsultationSessionModule {}
