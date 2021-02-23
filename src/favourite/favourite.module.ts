import { Module } from '@nestjs/common';
import { FavouriteService } from './favourite.service';
import { FavouriteController } from './favourite.controller';
import { FavouriteDto } from './dto/favourite.dto';
import { UtilsModule } from '../utils/utils.module';
import { CheckoutModule } from '../checkout/checkout.module';

@Module({
  providers: [FavouriteService, FavouriteDto],
  controllers: [FavouriteController],
  imports: [
    UtilsModule,
    CheckoutModule
  ],
  exports: [FavouriteService]
})
export class FavouriteModule {}
