import { Controller } from '@nestjs/common';

@Controller('help')
export class HelpController {
  constructor(@inject(AuthUtil) private authService: AuthUtil,
              @inject(HelpService) private helpService: HelpService) {
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
