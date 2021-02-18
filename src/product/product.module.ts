import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductDto } from './dto/product.dto';
import { UtilsModule } from '../utils/utils.module';

@Module({
  controllers: [ProductController],
  providers: [ProductService, ProductDto],
  imports: [
    UtilsModule
  ]
})
export class ProductModule {}
