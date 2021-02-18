import { Module } from '@nestjs/common';
import { FavouriteService } from './favourite.service';
import { FavouriteController } from './favourite.controller';
import { FavouriteDto } from './dto/favourite.dto';
import { UserModule } from '../user/user.module';
import { UtilsModule } from '../utils/utils.module';
import { CheckoutModule } from '../checkout/checkout.module';

@Module({
  providers: [FavouriteService],
  controllers: [FavouriteController, FavouriteDto],
  imports: [
    UserModule,
    UtilsModule,
    CheckoutModule
  ]
})
export class FavouriteModule {}
