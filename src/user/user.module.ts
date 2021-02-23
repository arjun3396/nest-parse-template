import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UtilsModule } from '../utils/utils.module';
import { FavouriteModule } from '../favourite/favourite.module';
import { CheckoutModule } from '../checkout/checkout.module';
import { InstantCheckupModule } from '../instant-checkup/instant-checkup.module';
import { OrderModule } from '../order/order.module';
import { UserDto } from './dto/user.dto';
import { ConsultationSessionModule } from '../consultation-session/consultation-session.module';

@Module({
  controllers: [UserController],
  providers: [UserService, UserDto],
  imports: [
    UtilsModule,
    FavouriteModule,
    CheckoutModule,
    InstantCheckupModule,
    ConsultationSessionModule,
    OrderModule,
  ],
  exports: [UserService]
})
export class UserModule {}
