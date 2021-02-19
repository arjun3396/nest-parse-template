import { Module } from '@nestjs/common';
import { CheckoutController } from './checkout.controller';
import { CheckoutService } from './checkout.service';
import { CheckoutDto } from './dto/checkout.dto';
import { UtilsModule } from '../utils/utils.module';

@Module({
  controllers: [CheckoutController],
  providers: [CheckoutService, CheckoutDto],
  imports: [
    UtilsModule
  ]
})
export class CheckoutModule {}
