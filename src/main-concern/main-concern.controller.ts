import { Controller } from '@nestjs/common';
import { AuthUtil } from '../utils/auth.util';
import { MainConcernService } from './main-concern.service';
import { SentryUtil } from '../utils/sentry.util';

@Controller('main-concern')
export class MainConcernController {
  constructor(private authService: AuthUtil,
              private mainConcernService: MainConcernService) {
    this.initialize();
  }

  initialize(): void {
    this.addMainConcern();
    this.getAllMainConcern();
  }

  addMainConcern(): void {
    this.authService.authenticatedCloudFunction('addMainConcern', async (req: Parse.Cloud.FunctionRequest) => {
      try {
        const result = await this.mainConcernService.addMainConcern(req.params.concern, req.params.concernClass);
        return result;
      } catch (error) {
        SentryUtil.captureException(error);
        return Promise.reject(error);
      }
    });
  }

  getAllMainConcern(): void {
    this.authService.authenticatedCloudFunction('getAllMainConcern', async () => {
      try {
        const result = await this.mainConcernService.getAllMainConcern();
        return result;
      } catch (error) {
        SentryUtil.captureException(error);
        return Promise.reject(error);
      }
    });
  }
}
