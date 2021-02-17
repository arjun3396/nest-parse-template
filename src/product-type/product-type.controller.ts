import { Controller } from '@nestjs/common';

@Controller('product-type')
export class ProductTypeController {
  constructor(@inject(AuthUtil) private authService: AuthUtil,
              @inject(ProductTypeService) private productTypeService: ProductTypeService) {
    this.initialize();
  }

  initialize(): void {
    this.addProductType();
    this.getAllProductTypes();
  }

  addProductType(): void {
    this.authService.authenticatedCloudFunction('addProductType', async (req: Parse.Cloud.FunctionRequest) => {
      let result: { [key: string]: any } = {};
      try {
        result = await this.productTypeService.addProductType(req.params.type);
      } catch (error) {
        SentryUtil.captureException(error);
        await Promise.reject(error);
      }
      return result;
    });
  }

  getAllProductTypes(): void {
    this.authService.authenticatedCloudFunction('getAllProductTypes', async () => {
      let result: Array<Parse.Object> = [];
      try {
        result = await this.productTypeService.getAllProductTypes();
      } catch (error) {
        SentryUtil.captureException(error);
        await Promise.reject(error);
      }
      return result;
    });
  }
}
