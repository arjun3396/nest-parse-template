import { Controller } from '@nestjs/common';
import { AuthUtil } from '../utils/auth.util';
import { EventEmitterUtil } from '../utils/eventEmitter.util';
import { ProductService } from '../product/product.service';
import { SentryUtil } from '../utils/sentry.util';
import { CheckoutService } from '../checkout/checkout.service';
import { FavouriteService } from '../favourite/favourite.service';

@Controller('product-api')
export class ProductApiController {
  constructor(private authService: AuthUtil,
              private eventEmitterUtil: EventEmitterUtil,
              private productService: ProductService,
              private checkoutService: CheckoutService,
              private favoriteService: FavouriteService) {
    this.initialize();
  }

  initialize(): void {
    this.getProductsByTitle();
    this.getProductsByTag();
    this.getProductsByType();
    this.getProductById();
  }

  getProductsByType(): void {
    this.authService.authenticatedCloudFunction('getProductsByType',
      async (req: Parse.Cloud.FunctionRequest, option: Parse.FullOptions) => {
        let result: Array<{[key: string]: any}> = [];
        try {
          result = await this.productService.getProductsByType(req.params.type, req.user, option);
        } catch (error) {
          await Promise.reject(error);
        }
        return result;
      });
  }

  getProductsByTag(): void {
    this.authService.authenticatedCloudFunction('getProductsByTag',
      async (req: Parse.Cloud.FunctionRequest, option: Parse.FullOptions) => {
        let result: Array<{[key: string]: any}> = [];
        try {
          result = await this.productService.getProductsByTag(req.params.tag, req.user, option, req.params.limit);
        } catch (error) {
          SentryUtil.captureException(error);
          await Promise.reject(error);
        }
        return result;
      });
  }

  getProductsByTitle(): void {
    this.authService.authenticatedCloudFunction('getProductsByTitle',
      async (req: Parse.Cloud.FunctionRequest, option: Parse.FullOptions) => {
        let result: Array<{[key: string]: any}> = [];
        try {
          result = await this.productService.getProductsByTitle(req.params.title, req.user, option, req.params.limit);
        } catch (error) {
          SentryUtil.captureException(error);
          await Promise.reject(error);
        }
        return result;
      });
  }

  getProductById(): void {
    this.authService.authenticatedCloudFunction('getProductById', async (req: Parse.Cloud.FunctionRequest, option: Parse.FullOptions) => {
      let result: Array<{[key: string]: any}> = [];
      try {
        result = await this.productService.getProductById(req.params.productId, req.user, option);
        const checkout: {[key: string]: any } = await this.checkoutService.getCheckout(req.user, option);
        const favorites: Array<{ [key: string]: any }> = await this.favoriteService.getAllFavourites(req.user, option);
        return this.productService.checkIfProductsAreAddedInCheckoutOrFavourites(result, checkout, favorites);
      } catch (error) {
        SentryUtil.captureException(error);
        await Promise.reject(error);
      }
      return result;
    });
  }
}
