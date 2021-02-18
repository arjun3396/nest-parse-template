import { Controller } from '@nestjs/common';
import { HelpService } from './help.service';
import { AuthUtil } from '../utils/auth.util';
import { SentryUtil } from '../utils/sentry.util';

@Controller('help')
export class HelpController {
  constructor(private authService: AuthUtil,
              private helpService: HelpService) {
    this.initialize();
  }

  initialize(): void {
    this.addHelp();
  }

  addHelp(): void {
    this.authService.authenticatedCloudFunction('addHelp', async (req: Parse.Cloud.FunctionRequest) => {
      let result: Parse.Object;
      try {
        result = await this.helpService.addHelpIfRequireParamsExists(req.params, req.user);
      } catch (error) {
        SentryUtil.captureException(error);
        await Promise.reject(error);
      }
      return result;
    });
  }
}
