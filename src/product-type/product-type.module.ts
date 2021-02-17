import { Module } from '@nestjs/common';
import { ProductTypeService } from './product-type.service';
import { ProductTypeController } from './product-type.controller';

@Module({
  providers: [ProductTypeService],
  controllers: [ProductTypeController]
})
export class ProductTypeModule {}
