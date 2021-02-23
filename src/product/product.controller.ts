import { Controller } from '@nestjs/common';
import { ProductService } from './product.service';
import { EventEmitterUtil } from '../utils/eventEmitter.util';
import { AuthUtil } from '../utils/auth.util';
import { SentryUtil } from '../utils/sentry.util';

@Controller('product')
export class ProductController {
  constructor(private authService: AuthUtil,
              private eventEmitterUtil: EventEmitterUtil,
              private productService: ProductService) {
    this.initialize();
  }

  initialize(): void {
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
}
