import { Controller } from '@nestjs/common';
import { AuthUtil } from '../utils/auth.util';
import { QuestionService } from './question.service';
import { SentryUtil } from '../utils/sentry.util';

@Controller('question')
export class QuestionController {
  constructor(private authService: AuthUtil,
              private questionService: QuestionService) {
    this.initialize();
  }

  initialize(): void {
    this.addQuestion();
  }

  addQuestion(): void {
    this.authService.authenticatedCloudFunction('addQuestion', async (req: Parse.Cloud.FunctionRequest) => {
      let result: Parse.Object;
      try {
        result = await this.questionService.addQuestionIfRequireParamsExists(req.params);
      } catch (error) {
        SentryUtil.captureException(error);
        await Promise.reject(error);
      }
      return result;
    });
  }
}
