import { Controller } from '@nestjs/common';

@Controller('favourite')
export class FavouriteController {
  constructor(@inject(AuthUtil) private authService: AuthUtil,
              @inject(FavouriteService) private favouriteService: FavouriteService) {
    this.initialize();
  }

  initialize(): void {
    this.getAllFavourites();
    this.addToFavourite();
    this.removeFromFavourite();
    this.moveFromFavouriteToCheckout();
  }

  getAllFavourites(): void {
    this.authService.authenticatedCloudFunction('getAllFavourites', async (req: Parse.Cloud.FunctionRequest, option: Parse.FullOptions) => {
      let result: Array<{ [key: string]: any }>;
      try {
        result = await this.favouriteService.getAllFavourites(req.user, option);
      } catch (error) {
        SentryUtil.captureException(error);
        await Promise.reject(error);
      }
      return result;
    });
  }

  addToFavourite(): void {
    this.authService.authenticatedCloudFunction('addToFavourite', async (req: Parse.Cloud.FunctionRequest, option: Parse.FullOptions) => {
      let result: Array<{ [key: string]: any }>;
      try {
        result = await this.favouriteService.addToFavourite(req.user, req.params.productId, option);
      } catch (error) {
        SentryUtil.captureException(error);
        await Promise.reject(error);
      }
      return result;
    });
  }

  removeFromFavourite(): void {
    this.authService.authenticatedCloudFunction('removeFromFavourite',
      async (req: Parse.Cloud.FunctionRequest, option: Parse.FullOptions) => {
        let result: Array<{[key: string]: any}>;
        try {
          result = await this.favouriteService.removeFromFavourite(req.user, req.params.productId, option);
        } catch (error) {
          SentryUtil.captureException(error);
          await Promise.reject(error);
        }
        return result;
      });
  }

  moveFromFavouriteToCheckout(): void {
    this.authService.authenticatedCloudFunction('moveFromFavouriteToCheckout',
      async (req: Parse.Cloud.FunctionRequest, option: Parse.FullOptions) => {
        let result: Array<{[key: string]: any}>;
        try {
          result = await this.favouriteService.moveFromFavouriteToCheckout(req.user, req.params.productId, option);
        } catch (error) {
          SentryUtil.captureException(error);
          await Promise.reject(error);
        }
        return result;
      });
  }
}
