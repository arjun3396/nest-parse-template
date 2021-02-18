import { Module } from '@nestjs/common';
import { FavouriteService } from './favourite.service';
import { FavouriteController } from './favourite.controller';
import { FavouriteDto } from './dto/favourite.dto';

@Module({
  providers: [FavouriteService],
  controllers: [FavouriteController, FavouriteDto]
})
export class FavouriteModule {}
