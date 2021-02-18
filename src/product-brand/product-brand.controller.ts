import { Controller } from '@nestjs/common';
import { ProductBrandService } from './product-brand.service';
import { AuthUtil } from '../utils/auth.util';
import { SentryUtil } from '../utils/sentry.util';

@Controller('product-brand')
export class ProductBrandController {
  constructor(private authService: AuthUtil,
              private productBrandService: ProductBrandService) {
    this.initialize();
  }

  initialize(): void {
    this.addProductBrand();
    this.getAllProductBrands();
  }

  addProductBrand(): void {
    this.authService.authenticatedCloudFunction('addProductBrand', async (req: Parse.Cloud.FunctionRequest) => {
      try {
        const result = await this.productBrandService.addProductBrand(req.params.brand);
        return result;
      } catch (error) {
        SentryUtil.captureException(error);
        return Promise.reject(error);
      }
    });
  }

  getAllProductBrands(): void {
    this.authService.authenticatedCloudFunction('getAllProductBrands', async () => {
      try {
        const result = await this.productBrandService.getAllProductBrands();
        return result;
      } catch (error) {
        SentryUtil.captureException(error);
        return Promise.reject(error);
      }
    });
  }
}
