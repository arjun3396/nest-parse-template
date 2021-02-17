import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductTypeService {
  constructor(@inject(QueryUtil) private queryUtil: QueryUtil) {}

  async addProductType(type: string): Promise<{ [key: string]: any }> {
    if (!type) { return { result: 'failed', message: 'Missing required parameter: type' }; }
    const productType = new CollectionUtil.ProductTypes();
    productType.set('name', type);
    await productType.save({}, { useMasterKey: true });
    return { result: 'success', productTypeId: productType.id };
  }

  async getAllProductTypes(): Promise<Array<Parse.Object>> {
    const allProductTypes = await this.queryUtil.find(CollectionUtil.ProductTypes, { where: {}, select: ['name'] });
    return allProductTypes;
  }
}
