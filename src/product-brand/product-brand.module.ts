import { Module } from '@nestjs/common';
import { ProductBrandService } from './product-brand.service';
import { ProductBrandController } from './product-brand.controller';
import { UtilsModule } from '../utils/utils.module';

@Module({
  providers: [ProductBrandService],
  controllers: [ProductBrandController],
  imports: [
    UtilsModule
  ]
})
export class ProductBrandModule {}
