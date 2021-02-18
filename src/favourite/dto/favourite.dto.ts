import { Injectable } from '@nestjs/common';
import { CollectionUtil, QueryUtil } from '../../utils/query.util';

@Injectable()
export class FavouriteDto {
  constructor(private queryUtil: QueryUtil) {}

  async fetchFavourites(user: Parse.Object, option: Parse.FullOptions): Promise<Array<Parse.Object>> {
    const favorites = await this.queryUtil.find(CollectionUtil.Favourite, {
      where: { user },
      include: ['product'],
      option,
    });
    return favorites;
  }

  async saveFavorite(user: Parse.Object, productId: string, option: Parse.FullOptions): Promise<any> {
    const favourite = new CollectionUtil.Favourite();
    const product = await this.queryUtil.findOne(CollectionUtil.Product, { where: { objectId: productId }, option });
    if (!product) { return 'No product found for this id'; }
    favourite.set('user', user);
    favourite.set('product', product);
    return favourite.save({}, option);
  }

  async destroyFavorite(user: Parse.Object, productId: string, option: Parse.FullOptions): Promise<Array<{ [key: string]: any }>> {
    const product = await this.queryUtil.findOne(CollectionUtil.Product, { where: { objectId: productId }, option });
    if (!product) {
      await Promise.reject(new Error('No Product found with given productId'));
    }
    const favorite = await this.queryUtil.findOne(CollectionUtil.Favourite, {
      where: { user, product },
      option,
    });
    if (!favorite) {
      return [];
    }
    await favorite.destroy(option);
    return product.get('variants') as Array<{ [key: string]: any }>;
  }
}
