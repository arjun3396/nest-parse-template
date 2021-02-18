import { Module } from '@nestjs/common';
import { CheckoutController } from './checkout.controller';
import { CheckoutService } from './checkout.service';
import { CheckoutDto } from './dto/checkout.dto';
import { UtilsModule } from '../utils/utils.module';
import { UserModule } from '../user/user.module';
import { OrderModule } from '../order/order.module';
import { ConsultationSessionModule } from '../consultation-session/consultation-session.module';
import { ProductModule } from '../product/product.module';

@Module({
  controllers: [CheckoutController],
  providers: [CheckoutService, CheckoutDto],
  imports: [
    UtilsModule,
    UserModule,
    OrderModule,
    ConsultationSessionModule,
    ProductModule
  ]
})
export class CheckoutModule {}
