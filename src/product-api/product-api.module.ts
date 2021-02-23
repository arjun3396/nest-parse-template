import { Module } from '@nestjs/common';
import { ProductApiController } from './product-api.controller';
import { UtilsModule } from '../utils/utils.module';
import { CheckoutModule } from '../checkout/checkout.module';
import { FavouriteModule } from '../favourite/favourite.module';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [UtilsModule, CheckoutModule, FavouriteModule, ProductModule],
  controllers: [ProductApiController]
})
export class ProductApiModule {}
