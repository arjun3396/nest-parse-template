import { Controller } from '@nestjs/common';
import { AuthUtil } from '../utils/auth.util';
import { OrderService } from './order.service';
import { SentryUtil } from '../utils/sentry.util';

@Controller('order')
export class OrderController {
  constructor(private authService: AuthUtil,
              private orderService: OrderService) {
    this.initialize();
  }

  initialize(): void {
    this.getOrderHistory();
    this.getOrderDetails();
    this.repeatOrder();
  }

  repeatOrder(): void {
    this.authService.authenticatedCloudFunction('repeatOrder', async (req: Parse.Cloud.FunctionRequest, option: Parse.FullOptions) => {
      let result: { [key: string]: any };
      try {
        result = await this.orderService.repeatOrder(req.params.orderId, req.user, option);
      } catch (error) {
        SentryUtil.captureException(error);
        await Promise.reject(error);
      }
      return result;
    });
  }

  getOrderHistory(): void {
    this.authService.authenticatedCloudFunction('getOrderHistory', async (req: Parse.Cloud.FunctionRequest, option: Parse.FullOptions) => {
      let result: Array<{ [key: string]: any }> = [];
      try {
        result = await this.orderService.getOrderHistory(req.user, option);
      } catch (error) {
        SentryUtil.captureException(error);
        return Promise.reject(error);
      }
      return result;
    });
  }

  getOrderDetails(): void {
    this.authService.authenticatedCloudFunction('getOrderDetails', async (req: Parse.Cloud.FunctionRequest, option: Parse.FullOptions) => {
      let result: { [key: string]: any};
      try {
        result = await this.orderService.getOrderDetails(req.user, req.params.orderId, option);
      } catch (error) {
        SentryUtil.captureException(error);
        return Promise.reject(error);
      }
      return result;
    });
  }
}
