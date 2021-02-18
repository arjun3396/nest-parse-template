import { Module } from '@nestjs/common';
import { TreeController } from './tree.controller';
import { TreeService } from './tree.service';
import { UtilsModule } from '../utils/utils.module';
import { UserModule } from '../user/user.module';
import { QuestionModule } from '../question/question.module';
import { ConsultationSessionModule } from '../consultation-session/consultation-session.module';

@Module({
  controllers: [TreeController],
  providers: [TreeService],
  imports: [
    UtilsModule,
    UserModule,
    QuestionModule,
    ConsultationSessionModule
  ]
})
export class TreeModule {}
