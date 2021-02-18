import { Module } from '@nestjs/common';
import { ConsultationSessionService } from './consultation-session.service';
import { ConsultationSessionDto } from './dto/consultation-session.dto';

@Module({
  providers: [ConsultationSessionService, ConsultationSessionDto]
})
export class ConsultationSessionModule {}
