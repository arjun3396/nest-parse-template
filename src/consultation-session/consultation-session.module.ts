import { Module } from '@nestjs/common';
import { ConsultationSessionService } from './consultation-session.service';

@Module({
  providers: [ConsultationSessionService]
})
export class ConsultationSessionModule {}
