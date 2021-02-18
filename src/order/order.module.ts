import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderDto } from './dto/order.dto';
import { ConsultationSessionModule } from '../consultation-session/consultation-session.module';
import { UtilsModule } from '../utils/utils.module';
import { ProductModule } from '../product/product.module';

@Module({
  controllers: [OrderController],
  providers: [OrderService, OrderDto],
  imports: [
    ConsultationSessionModule,
    UtilsModule,
    ProductModule
  ]
})
export class OrderModule {}
