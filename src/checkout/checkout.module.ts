import { Module } from '@nestjs/common';
import { CheckoutController } from './checkout.controller';
import { CheckoutService } from './checkout.service';
import { CheckoutDto } from './dto/checkout.dto';

@Module({
  controllers: [CheckoutController],
  providers: [CheckoutService, CheckoutDto]
})
export class CheckoutModule {}
