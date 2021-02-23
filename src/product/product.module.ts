import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { UtilsModule } from '../utils/utils.module';
import { ProductDto } from './dto/product.dto';

@Module({
  controllers: [ProductController],
  providers: [ProductService, ProductDto],
  imports: [UtilsModule],
  exports: [ProductService]
})
export class ProductModule {}
