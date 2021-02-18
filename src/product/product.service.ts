import { Injectable } from '@nestjs/common';
import { QueryUtil } from '../utils/query.util';
import { ProductDto } from './dto/product.dto';
import { CheckoutService } from '../checkout/checkout.service';
import { FavouriteService } from '../favourite/favourite.service';

@Injectable()
export class ProductService {
  constructor(private queryUtil: QueryUtil,
              private productDto: ProductDto,
              private checkoutService: CheckoutService,
              private favoriteService: FavouriteService) {}

  checkIfAddedToCheckout(result: Array<{[key: string]: any }>, checkout: { [key: string]: any }): any {
    if (checkout.lineItems.length) {
      result.forEach((item: any) => {
        if (item.variants.length) {
          checkout.lineItems.forEach((lineItem: any) => {
            if (item.variants.some((variant: any) => variant.storefrontId === lineItem.storefrontId)) {
              // eslint-disable-next-line no-param-reassign
              item.addedToCheckout = true;
              // eslint-disable-next-line no-param-reassign
              item.quantity = lineItem.quantity;
            }
          });
        }
      });
    }
    return result;
  }

  checkIfAddedToFavorite(result: Array<{ [key: string]: any }>, favorites: Array<{ [key: string]: any }>): any {
    if (favorites.length) {
      const favoriteStorefrontIds = [];
      favorites.forEach((favorite: any) => {
        favorite.product.variants.forEach((variant: any) => favoriteStorefrontIds.push(variant.storefrontId));
      });

      result.forEach((item: any) => {
        if (item.variants.length) {
          if (item.variants.some((variant: any) => favoriteStorefrontIds.includes(variant.storefrontId))) {
            // eslint-disable-next-line no-param-reassign
            item.addedToFavorite = true;
          }
        }
      });
    }
    return result;
  }

  async getProductById(objectId: string, user: Parse.Object, option: Parse.FullOptions): Promise<Array<{[key: string]: any}>> {
    const result: Parse.Object = await this.productDto.findById(objectId, option);
    if (!result) { await Promise.reject(new Error(`No product found with objectId: ${objectId}`)); }
    let resultJSON: Array<{[key: string]: any }> = [result].map((product) => JSON.parse(JSON.stringify(product)) as {[key: string]: any });
    const checkout: {[key: string]: any } = await this.checkoutService.getCheckout(user, option);
    const favorites: Array<{ [key: string]: any }> = await this.favoriteService.getAllFavourites(user, option);
    resultJSON = this.checkIfAddedToCheckout(resultJSON, checkout);
    resultJSON = this.checkIfAddedToFavorite(resultJSON, favorites);
    if (resultJSON[0].addedToCheckout) {
      // eslint-disable-next-line no-param-reassign
      resultJSON[0].variants.forEach((variant: { [key: string]: any }) => variant.addedToCheckout = true);
    }
    if (resultJSON[0].addedToFavorite) {
      // eslint-disable-next-line no-param-reassign
      resultJSON[0].variants.forEach((variant: { [key: string]: any }) => variant.addedToFavorite = true);
    }
    return resultJSON[0].variants as Array<{[key: string]: any}>;
  }

  async getProductsByType(productType: string, user: Parse.Object, option: Parse.FullOptions): Promise<Array<{ [key: string]: any }>> {
    const result: Array<Parse.Object> = await this.productDto.findByType(productType, option);
    if (!result.length) { await Promise.reject(new Error(`No product found with type: ${productType}`)); }
    let resultJSON: Array<{ [key: string]: any }> = result.map((product) => JSON.parse(JSON.stringify(product)) as { [key: string]: any });
    const checkout = await this.checkoutService.getCheckout(user, option);
    const favorites = await this.favoriteService.getAllFavourites(user, option);
    resultJSON = this.checkIfAddedToCheckout(resultJSON, checkout);
    resultJSON = this.checkIfAddedToFavorite(resultJSON, favorites);
    return resultJSON;
  }

  async getProductsByTag(tag: string, user: Parse.Object, option: Parse.FullOptions, limit?: number): Promise<Array<{[key: string]: any}>> {
    const result: Array<Parse.Object> = await this.productDto.findByTags([tag], option, limit);
    if (!result.length) { await Promise.reject(new Error(`No product found with tag: ${tag}`)); }
    let resultJSON: Array<{[key: string]: any}> = result.map((product) => JSON.parse(JSON.stringify(product)) as { [key: string]: any });
    const checkout = await this.checkoutService.getCheckout(user, option);
    const favorites = await this.favoriteService.getAllFavourites(user, option);
    resultJSON = this.checkIfAddedToCheckout(resultJSON, checkout);
    resultJSON = this.checkIfAddedToFavorite(resultJSON, favorites);
    return resultJSON;
  }

  async getProductsByTitle(title: string, user: Parse.Object, option: Parse.FullOptions, limit?: number)
    : Promise<Array<{[key: string]: any}>> {
    const result: Array<Parse.Object> = await this.productDto.findByTitle(title, option, limit);
    if (!result.length) { await Promise.reject(new Error(`No product found with name: ${title}`)); }
    let resultJSON: Array<{[key: string]: any}> = result.map((product) => JSON.parse(JSON.stringify(product)) as { [key: string]: any });
    const checkout = await this.checkoutService.getCheckout(user, option);
    const favorites = await this.favoriteService.getAllFavourites(user, option);
    resultJSON = this.checkIfAddedToCheckout(resultJSON, checkout);
    resultJSON = this.checkIfAddedToFavorite(resultJSON, favorites);
    return resultJSON;
  }

  async getProductsByTagForTreeResponse(tag: string): Promise<Array<{[key: string]: any}>> {
    const result: Array<Parse.Object> = await this.productDto.findByTagsForTree([tag], { useMasterKey: true });
    if (!result.length) { await Promise.reject(new Error(`No product found with tag: ${tag}`)); }
    const resultJSON: Array<{[key: string]: any}> = result.map((product) => JSON.parse(JSON.stringify(product)) as { [key: string]: any });
    return resultJSON;
  }
}
