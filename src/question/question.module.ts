import { Module } from '@nestjs/common';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { QuestionDto } from './dto/question.dto';
import { UtilsModule } from '../utils/utils.module';

@Module({
  controllers: [QuestionController],
  providers: [QuestionService, QuestionDto],
  imports: [UtilsModule]
})
export class QuestionModule {}
