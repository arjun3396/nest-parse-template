import { Controller } from '@nestjs/common';

@Controller('order')
export class OrderController {
  constructor(@inject(AuthUtil) private authService: AuthUtil,
              @inject(OrderService) private orderService: OrderService) {
    this.initialize();
  }

  initialize(): void {
    this.getOrderHistory();
    this.getOrderDetails();
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
