import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderDto } from './dto/order.dto';
import { UtilsModule } from '../utils/utils.module';
import { ProductModule } from '../product/product.module';
import { FavouriteModule } from '../favourite/favourite.module';
import { CheckoutModule } from '../checkout/checkout.module';
import { PurchaseHistoryModule } from '../purchase-history/purchase-history.module';

@Module({
  controllers: [OrderController],
  providers: [OrderService, OrderDto],
  imports: [
    UtilsModule,
    ProductModule,
    FavouriteModule,
    CheckoutModule,
    PurchaseHistoryModule,
  ],
  exports: [OrderService]
})
export class OrderModule {}
