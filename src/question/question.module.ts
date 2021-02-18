import { Module } from '@nestjs/common';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { QuestionDto } from './dto/question.dto';

@Module({
  controllers: [QuestionController],
  providers: [QuestionService, QuestionDto]
})
export class QuestionModule {}
