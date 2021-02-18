import { Controller } from '@nestjs/common';
import { AuthUtil } from '../utils/auth.util';
import { TreeService } from './tree.service';
import { SentryUtil } from '../utils/sentry.util';

@Controller('tree')
export class TreeController {
  constructor(private authService: AuthUtil,
              private treeService: TreeService) {
    this.initialize();
  }

  initialize(): void {
    this.getQuestion();
    this.saveAnswer();
    this.getPreviousQuestion();
  }

  getQuestion(): void {
    this.authService.authenticatedCloudFunction('getQuestion', async (req: Parse.Cloud.FunctionRequest, option: Parse.FullOptions) => {
      let result: {[key: string]: any};
      try {
        result = await this.treeService.getNextTreeNode(req.user, option);
      } catch (error) {
        SentryUtil.captureException(error);
        await Promise.reject(error);
      }
      return result;
    });
  }

  getPreviousQuestion(): void {
    this.authService.authenticatedCloudFunction('getPreviousQuestion',
      async (req: Parse.Cloud.FunctionRequest, option: Parse.FullOptions) => {
        let result: {[key: string]: any};
        try {
          result = await this.treeService.getPreviousTreeNode(req.user, option);
        } catch (error) {
          SentryUtil.captureException(error);
          await Promise.reject(error);
        }
        return result;
      });
  }

  saveAnswer(): void {
    this.authService.authenticatedCloudFunction('saveAnswer', async (req: Parse.Cloud.FunctionRequest, option: Parse.FullOptions) => {
      let result: {[key: string]: any};
      try {
        const { answer } = req.params;
        if (!answer) { return 'Required params missing: answer'; }
        console.log('MONITOR saveAnswer', answer, req.user.get('activeConcern'));
        result = await this.treeService.storeUserResponseToQuestion(answer, req.user, option);
        console.log('MONITOR saveAnswer result', result);
      } catch (error) {
        SentryUtil.captureException(error);
        await Promise.reject(error);
      }
      return result;
    });
  }
}
