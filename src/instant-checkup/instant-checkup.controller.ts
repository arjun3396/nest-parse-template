import { Controller } from '@nestjs/common';

@Controller('instant-checkup')
export class InstantCheckupController {
  constructor(@inject(AuthUtil) private authService: AuthUtil,
              @inject(InstantCheckupService) private instantCheckupService: InstantCheckupService,
              @inject(UserModel) private userModel: UserModel) {
    this.initialize();
  }

  initialize(): void {
    this.saveInstantCheckupAndGetAllInstantCheckupURLs();
    this.getPreviousInstantCheckups();
    this.validateToken();
    this.deleteInstantCheckup();
  }

  validateToken(): void {
    this.authService.authenticatedCloudFunction('validateToken', async (req: Parse.Cloud.FunctionRequest, option: Parse.FullOptions) => {
      try {
        if (!req.user.get('type')) { return req.user; }
        const { userId }: Parse.Cloud.Params = req.params;
        if (!userId) {
          await Promise.reject(new Error('userid is missing'));
        }
        const result = this.userModel.findUserByUsername(userId, option);
        return result;
      } catch (error) {
        await Promise.reject(new Error(error));
      }
    });
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
