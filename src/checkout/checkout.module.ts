import { Module } from '@nestjs/common';
import { CheckoutController } from './checkout.controller';
import { CheckoutService } from './checkout.service';
import { CheckoutDto } from './dto/checkout.dto';
import { UtilsModule } from '../utils/utils.module';
import { ProductModule } from '../product/product.module';
import { ConsultationSessionModule } from '../consultation-session/consultation-session.module';

@Module({
  controllers: [CheckoutController],
  providers: [CheckoutService, CheckoutDto],
  imports: [
    UtilsModule,
    ProductModule,
    ConsultationSessionModule
  ],
  exports: [CheckoutService]
})
export class CheckoutModule {}
