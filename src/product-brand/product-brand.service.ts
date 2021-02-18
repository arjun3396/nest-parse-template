import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductBrandService {
  constructor(@inject(QueryUtil) private queryService: QueryUtil) {}

  async addProductBrand(brand: string): Promise<{ [key: string]: any }> {
    if (!brand) { return { result: 'failed', message: 'Missing required parameter: brand' }; }
    const productBrand = new CollectionUtil.ProductBrands();
    productBrand.set('name', brand);
    await productBrand.save({}, { useMasterKey: true });
    return { result: 'success', productTypeId: productBrand.id };
  }

  async getAllProductBrands(): Promise<{ [key: string]: any }> {
    const allProductTypes = await this.queryService.find(CollectionUtil.ProductTypes, { where: {}, select: ['name'] });
    return allProductTypes;
  }
}