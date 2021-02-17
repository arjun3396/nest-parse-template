import { Injectable } from '@nestjs/common';

@Injectable()
class ProductDto {
  constructor(@inject(QueryUtil) private query: QueryUtil) {}

  async findById(objectId: string, option: Parse.FullOptions): Promise<Parse.Object> {
    return this.query.findOne(CollectionUtil.Product, { where: { objectId }, option });
  }

  async findByTitle(title: string, option: Parse.FullOptions, limit?: number): Promise<Array<Parse.Object>> {
    if (limit) {
      return this.query.find(CollectionUtil.Product, { where: { title: { $regex: title, $options: 'i' }, visible: true }, limit, option });
    }
    return this.query.find(CollectionUtil.Product, { where: { title: { $regex: title, $options: 'i' }, visible: true }, option });
  }

  async findByTags(tags: Array<string>, option: Parse.FullOptions, limit?: number): Promise<Array<Parse.Object>> {
    if (limit) {
      return this.query.find(CollectionUtil.Product, { where: { tags, visible: true }, limit, option });
    }
    return this.query.find(CollectionUtil.Product, { where: { tags, visible: true }, option });
  }

  async findByTagsForTree(tags: Array<string>, option: Parse.FullOptions): Promise<Array<Parse.Object>> {
    return this.query.find(CollectionUtil.Product, { where: { tags }, option });
  }

  async findByType(productType: string, option: Parse.FullOptions): Promise<Array<Parse.Object>> {
    return this.query.find(CollectionUtil.Product, { where: { productType, visible: true }, option });
  }

  async findByVariantId(variantId: string, option: Parse.FullOptions): Promise<Parse.Object> {
    return this.query.findOne(CollectionUtil.Product, { where: { variantIds: variantId }, option });
  }

  async createQuestionWithData(data: { [key: string]: any }): Promise<Parse.Object> {
    const question = new CollectionUtil.Question();
    Object.keys(data).forEach((key: string) => question.set(key, data[key]));
    return question.save({}, { useMasterKey: true });
  }
}
