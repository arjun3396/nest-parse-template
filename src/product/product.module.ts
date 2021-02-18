import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductDto } from './dto/product.dto';

@Module({
  controllers: [ProductController],
  providers: [ProductService, ProductDto]
})
export class ProductModule {}
