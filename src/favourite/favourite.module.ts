import { Module } from '@nestjs/common';
import { FavouriteService } from './favourite.service';
import { FavouriteController } from './favourite.controller';
import { FavouriteDto } from './dto/favourite.dto';
import { UtilsModule } from '../utils/utils.module';

@Module({
  providers: [FavouriteService],
  controllers: [FavouriteController, FavouriteDto],
  imports: [
    UtilsModule
  ]
})
export class FavouriteModule {}
