import { Controller } from '@nestjs/common';
import { AuthUtil } from '../utils/auth.util';
import { InstantCheckupService } from './instant-checkup.service';
import { SentryUtil } from '../utils/sentry.util';

@Controller('instant-checkup')
export class InstantCheckupController {
  constructor(private authService: AuthUtil,
              private instantCheckupService: InstantCheckupService) {
    this.initialize();
  }

  initialize(): void {
    this.saveInstantCheckupAndGetAllInstantCheckupURLs();
    this.getPreviousInstantCheckups();
    this.deleteInstantCheckup();
  }

  saveInstantCheckupAndGetAllInstantCheckupURLs(): void {
    this.authService.authenticatedCloudFunction('saveInstantCheckupAndGetAllInstantCheckupURLs',
      async (req: Parse.Cloud.FunctionRequest) => {
        let result: Array<{ [key: string]: any }>;
        try {
          const savedInstantCheckups: Parse.Object = await this.instantCheckupService.saveInstantCheckup(req.user, req.params);
          const instantCheckups = await this.instantCheckupService
            .getPreviousInstantCheckups({ useMasterKey: true }, savedInstantCheckups.get('userId'), savedInstantCheckups.id);
          result = await this.instantCheckupService.signInstantCheckupURL(instantCheckups);
        } catch (error) {
          SentryUtil.captureException(error);
          await Promise.reject(error);
        }
        return result;
      });
  }

  deleteInstantCheckup(): void {
    this.authService.authenticatedCloudFunction('deleteInstantCheckup',
      async (req: Parse.Cloud.FunctionRequest, option: Parse.FullOptions) => {
        if (!req.params.instantCheckupId) {
          return { status: 'failed', message: 'Missing required params: instantCheckupId' };
        }
        let result: { [key: string]: any };
        try {
          result = await this.instantCheckupService
            .deleteInstantCheckup(req.user, req.params.instantCheckupId, option);
        } catch (error) {
          SentryUtil.captureException(error);
          await Promise.reject(error);
        }
        return result;
      });
  }

  getPreviousInstantCheckups(): void {
    this.authService
      .authenticatedCloudFunction('getPreviousInstantCheckups', async (req: Parse.Cloud.FunctionRequest, option: Parse.FullOptions) => {
        try {
          const instantCheckups = await this.instantCheckupService
            .getPreviousInstantCheckups(option, req.params.userId, req.params.objectId);
          return this.instantCheckupService.signInstantCheckupURL(instantCheckups);
        } catch (error) {
          SentryUtil.captureException(error);
          await Promise.reject(error);
        }
        return undefined;
      });
  }
}
