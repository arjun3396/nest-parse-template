import { Module } from '@nestjs/common';
import { ConsultationSessionService } from './consultation-session.service';
import { UtilsModule } from '../utils/utils.module';
import { UserResponseModule } from '../user-response/user-response.module';
import { ConsultationSessionDto } from './dto/consultation-session.dto';

@Module({
  providers: [ConsultationSessionService, ConsultationSessionDto],
  imports: [
    UserResponseModule,
    UtilsModule
  ],
  exports: [ConsultationSessionService]
})
export class ConsultationSessionModule {}
