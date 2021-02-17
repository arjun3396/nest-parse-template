import { Injectable } from '@nestjs/common';

@Injectable()
export class FavouriteService {
  constructor(@inject(CheckoutService) private checkoutService: CheckoutService,
              @inject(FavouriteModel) private favouriteModel: FavouriteModel,
              @inject(UserModel) private userModel: UserModel) {}

  async getAllFavourites(user: Parse.Object, option: Parse.FullOptions): Promise<Array<{ [key: string]: any }>> {
    const favourites: Array<Parse.Object> = await this.favouriteModel.fetchFavourites(user, option);
    let jsonifiedFavorites: Array<{ [key: string]: any }> = [];
    if (favourites.length) {
      jsonifiedFavorites = favourites.map((favorite: Parse.Object) => JSON.parse(JSON.stringify(favorite)) as { [key: string]: any });
    }
    return jsonifiedFavorites;
  }

  async getFavouritesCount(user: Parse.Object, option: Parse.FullOptions): Promise<number> {
    const favourites: Array<Parse.Object> = await this.favouriteModel.fetchFavourites(user, option);
    return favourites.length;
  }

  async addToFavourite(user: Parse.Object, productId: string, option: Parse.FullOptions): Promise<Array<{ [key: string]: any }>> {
    await this.favouriteModel.saveFavorite(user, productId, option);
    const favourites: Array<{ [key: string]: any }> = await this.getAllFavourites(user, option);
    return favourites;
  }

  async removeFromFavourite(user: Parse.Object, productId: string, option: Parse.FullOptions): Promise<Array<{ [key: string]: any }>> {
    await this.favouriteModel.destroyFavorite(user, productId, option);
    const favourites: Array<{ [key: string]: any }> = await this.getAllFavourites(user, option);
    return favourites;
  }

  async moveFromFavouriteToCheckout(user: Parse.Object, productId: string, option: Parse.FullOptions):
    Promise<Array<{ [key: string]: any }>> {
    const _user = await this.userModel.fetchUser(user, option);
    const destroyedFavoriteVariants = await this.favouriteModel.destroyFavorite(_user, productId, option);
    if (!destroyedFavoriteVariants.length) {
      return Promise.reject(new Error('No product found to add to checkout'));
    }
    await this.checkoutService.addProductToCheckout(destroyedFavoriteVariants[0].storefrontId, _user, option);
    const favourites: Array<{ [key: string]: any }> = await this.getAllFavourites(user, option);
    return favourites;
  }
}
