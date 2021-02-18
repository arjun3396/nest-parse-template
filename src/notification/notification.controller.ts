import { Controller } from '@nestjs/common';
import { AuthUtil } from '../utils/auth.util';
import { CollectionUtil, QueryUtil } from '../utils/query.util';
import { SentryUtil } from '../utils/sentry.util';

@Controller('notification')
export class NotificationController {
  constructor(private authService: AuthUtil,
              private queryUtil: QueryUtil) {
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
