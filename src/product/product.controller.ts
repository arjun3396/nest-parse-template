import { Controller } from '@nestjs/common';

@Controller('product')
export class ProductController {
  constructor(@inject(AuthUtil) private authService: AuthUtil,
              @inject(EventEmitterUtil) private eventEmitterUtil: EventEmitterUtil,
              @inject(ProductService) private productService: ProductService) {
    this.initialize();
  }

  initialize(): void {
    this.getProductsByTitle();
    this.getProductsByTag();
    this.getProductsByType();
    this.getProductById();
    this.syncProducts();
  }

  syncProducts(): void {
    this.authService.authenticatedCloudFunction('syncProducts', async () => {
      try {
        this.eventEmitterUtil.emitEvent('dumpLatestProductsToParse');
      } catch (error) {
        await Promise.reject(error);
      }
      return { status: 'success' };
    });
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
      } catch (error) {
        SentryUtil.captureException(error);
        await Promise.reject(error);
      }
      return result;
    });
  }
}
