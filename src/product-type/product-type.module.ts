import { Module } from '@nestjs/common';
import { ProductTypeService } from './product-type.service';
import { ProductTypeController } from './product-type.controller';
import { UtilsModule } from '../utils/utils.module';

@Module({
  providers: [ProductTypeService],
  controllers: [ProductTypeController],
  imports: [
    UtilsModule
  ]
})
export class ProductTypeModule {}
