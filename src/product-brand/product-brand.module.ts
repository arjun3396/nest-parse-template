import { Module } from '@nestjs/common';
import { ProductBrandService } from './product-brand.service';
import { ProductBrandController } from './product-brand.controller';

@Module({
  providers: [ProductBrandService],
  controllers: [ProductBrandController]
})
export class ProductBrandModule {}
