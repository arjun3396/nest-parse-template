import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderDto } from './dto/order.dto';

@Module({
  controllers: [OrderController],
  providers: [OrderService, OrderDto]
})
export class OrderModule {}
