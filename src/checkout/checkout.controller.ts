import { Controller } from '@nestjs/common';

@Controller('checkout')
export class CheckoutController {
  constructor(@inject(AuthUtil) private authService: AuthUtil,
              @inject(CheckoutService) private checkoutService: CheckoutService) {
    this.initialize();
  }

  initialize(): void {
    this.addProductToCheckout();
    this.addProductToCart();
    this.removeProductsFromCheckout();
    this.updateCheckout();
    this.getCheckout();
    this.repeatOrder();
    this.clearCheckout();
  }

  repeatOrder(): void {
    this.authService.authenticatedCloudFunction('repeatOrder', async (req: Parse.Cloud.FunctionRequest, option: Parse.FullOptions) => {
      let result: { [key: string]: any };
      try {
        result = await this.checkoutService.repeatOrder(req.params.orderId, req.user, option);
      } catch (error) {
        SentryUtil.captureException(error);
        await Promise.reject(error);
      }
      return result;
    });
  }

  clearCheckout(): void {
    this.authService.authenticatedCloudFunction('clearCheckout', async (req: Parse.Cloud.FunctionRequest, option: Parse.FullOptions) => {
      let result: { [key: string]: any };
      try {
        result = await this.checkoutService.clearCheckout(req.user, option);
      } catch (error) {
        SentryUtil.captureException(error);
        await Promise.reject(error);
      }
      return result;
    });
  }

  getCheckout(): void {
    this.authService.authenticatedCloudFunction('getCheckout', async (req: Parse.Cloud.FunctionRequest, option: Parse.FullOptions) => {
      let result: { [key: string]: any };
      try {
        result = await this.checkoutService.getCheckout(req.user, option);
      } catch (error) {
        SentryUtil.captureException(error);
        await Promise.reject(error);
      }
      return result;
    });
  }

  addProductToCheckout(): void {
    this.authService.authenticatedCloudFunction('addProductToCheckout',
      async (req: Parse.Cloud.FunctionRequest, option: Parse.FullOptions) => {
        let result: { [key: string]: any };
        try {
          result = await this.checkoutService.addProductToCheckout(req.params.variantId, req.user, option);
          return result;
        } catch (error) {
          SentryUtil.captureException(error);
          return Promise.reject(error);
        }
      });
  }

  addProductToCart(): void {
    this.authService.authenticatedCloudFunction('addProductToCart',
      async (req: Parse.Cloud.FunctionRequest, option: Parse.FullOptions) => {
        let result: { [key: string]: any };
        try {
          result = await this.checkoutService.addProductToCart(req.params.variantId, req.user, option);
          return result;
        } catch (error) {
          SentryUtil.captureException(error);
          return Promise.reject(error);
        }
      });
  }

  updateCheckout(): void {
    this.authService.authenticatedCloudFunction('updateCheckout',
      async (req: Parse.Cloud.FunctionRequest, option: Parse.FullOptions) => {
        let result: { [key: string]: any };
        try {
          result = await this.checkoutService.addLineItemsToStorefrontCheckout(req.user, option);
          return result;
        } catch (error) {
          SentryUtil.captureException(error);
          await Promise.reject(error);
        }
        return result;
      });
  }

  removeProductsFromCheckout(): void {
    this.authService.authenticatedCloudFunction('removeProductsFromCheckout',
      async (req: Parse.Cloud.FunctionRequest, option: Parse.FullOptions) => {
        let result: { [key: string]: any };
        try {
          result = await this.checkoutService
            .removeProductsFromCheckout(req.params.variantId, req.user, option);
          return result;
        } catch (error) {
          SentryUtil.captureException(error);
          return Promise.reject(error);
        }
        return result;
      });
  }
}
