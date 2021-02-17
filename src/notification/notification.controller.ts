import { Controller } from '@nestjs/common';

@Controller('notification')
export class NotificationController {
  constructor(@inject(AuthUtil) private authService: AuthUtil,
              @inject(QueryUtil) private queryUtil: QueryUtil) {
    this.initialize();
  }

  initialize(): void {
    this.findNewNotification();
  }

  findNewNotification(): void {
    this.authService.authenticatedCloudFunction('findNewNotification', async (req: Parse.Cloud.FunctionRequest,
                                                                              option: Parse.FullOptions) => {
      try {
        const { timeInMilli, limit }: Parse.Cloud.Params = req.params;
        if (!timeInMilli) {
          await Promise.reject(new Error('Time is missing'));
        }
        const pushNotifications = await this.queryUtil.find(CollectionUtil.PushStatus, {
          where: { query: `{"username":"${req.user.getUsername()}"}`, createdAt: { $gte: new Date(timeInMilli) } },
          ascending: 'createdAt',
          limit: limit || 100,
          option: this.authService.getMasterOption(option),
        });
        const result = pushNotifications.map((pushNotification: Parse.Object) => pushNotification.toJSON());
        return result;
      } catch (error) {
        SentryUtil.captureException(error);
        return Promise.reject(error);
      }
    });
  }
}
