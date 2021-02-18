import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { UtilsModule } from '../utils/utils.module';
import { CheckoutModule } from '../checkout/checkout.module';
import { OrderModule } from '../order/order.module';
import { InstantCheckupModule } from '../instant-checkup/instant-checkup.module';
import { FavouriteModule } from '../favourite/favourite.module';

@Module({
  controllers: [UserController],
  providers: [UserService, UserDto],
  imports: [
    UtilsModule,
    CheckoutModule,
    OrderModule,
    InstantCheckupModule,
    FavouriteModule
  ]
})
export class UserModule {}
