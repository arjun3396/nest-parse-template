import { Module } from '@nestjs/common';
import { ConsultationSessionService } from './consultation-session.service';
import { ConsultationSessionDto } from './dto/consultation-session.dto';
import { UtilsModule } from '../utils/utils.module';
import { UserResponseModule } from '../user-response/user-response.module';
import { UserModule } from '../user/user.module';

@Module({
  providers: [ConsultationSessionService, ConsultationSessionDto],
  imports: [
    UtilsModule,
    UserResponseModule,
    UserModule
  ]
})
export class ConsultationSessionModule {}
