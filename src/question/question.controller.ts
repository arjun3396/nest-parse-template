import { Controller } from '@nestjs/common';

@Controller('question')
export class QuestionController {
  constructor(@inject(AuthUtil) private authService: AuthUtil,
              @inject(QuestionService) private questionService: QuestionService) {
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
