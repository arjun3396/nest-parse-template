import { Injectable } from '@nestjs/common';
import { FavouriteDto } from '../favourite/dto/favourite.dto';
import { InstantCheckupDto } from '../instant-checkup/dto/instant-checkup.dto';
import { OrderDto } from '../order/dto/order.dto';
import { CheckoutDto } from '../checkout/dto/checkout.dto';
import { CollectionUtil, QueryUtil } from '../utils/query.util';
import { UserDto } from './dto/user.dto';
import { CheckoutService } from '../checkout/checkout.service';
import { OrderService } from '../order/order.service';
import { InstantCheckupService } from '../instant-checkup/instant-checkup.service';
import { FavouriteService } from '../favourite/favourite.service';

@Injectable()
export class UserService {
  constructor(private userDto: UserDto,
              private queryUtil: QueryUtil,
              private checkoutService: CheckoutService,
              private orderService: OrderService,
              private instantCheckupService: InstantCheckupService,
              private favouriteService: FavouriteService) {}

  async pushItemToConcernList(user: Parse.Object, concern: string): Promise<Parse.Object> {
    const _user = await this.userDto.fetchUser(user, { useMasterKey: true });
    const concernList = _user.get('concernList') || [];
    if (concernList.includes(concern)) { return _user; }
    concernList.push(concern);
    return _user.save({}, { useMasterKey: true });
  }

  async moveDataFromOldUserToNewUser(oldUserId: string, newUserId: string): Promise<{ [key: string]: any}> {
    if (!oldUserId || !newUserId) {
      return Promise.reject(new Error('Missing required params: oldUserId OR newUserId'));
    }
    const oldUser = await this.userDto.getUserPointer(oldUserId);
    const user = await this.userDto.findUserById(newUserId);
    if (!user) {
      return Promise.reject(new Error(`No new user found with id: ${newUserId}`));
    }

    const [favourites, checkout, orders, instantCheckups] = await Promise.all([
      this.favouriteService.fetchFavourites(oldUser, { useMasterKey: true }),
      this.checkoutService.findCheckout(oldUser, { useMasterKey: true }),
      this.orderService.getAllOrders(oldUser, { useMasterKey: true }),
      this.instantCheckupService.findInstantCheckups({ user: oldUser }, { useMasterKey: true }),
    ]);

    const promises = [];
    if (favourites.length) {
      favourites.forEach((item: Parse.Object) => promises.push(item.save({ user }, { useMasterKey: true })));
    }
    if (instantCheckups.length) {
      instantCheckups.forEach((item: Parse.Object) => promises.push(item.save({ user }, { useMasterKey: true })));
    }
    if (checkout) {
      await this.checkoutService.deleteCheckout(user, { useMasterKey: true });
      promises.push(checkout.save({ user }, { useMasterKey: true }));
      user.set('checkoutId', checkout.get('checkoutId'));
      user.set('checkoutToken', atob(checkout.get('checkoutId')).split('/')[4].split('?')[0]);
      await user.save({}, { useMasterKey: true });
    }
    if (orders.length) {
      orders.forEach((item: Parse.Object) => promises.push(item.save({ user }, { useMasterKey: true })));
    }
    await Promise.all(promises);
    return { status: 'success' };
  }

  async findOrCreateNewUserIfNotExistingUser(params: { [key: string]: any }): Promise<Parse.Object> {
    const { email, patientName, deviceId, signupSource, authData } = params;
    let authDataId;
    if (typeof authData === 'string') {
      authDataId = JSON.parse(authData).id;
    } else {
      authDataId = authData.id;
    }
    const user = await this.findOrSignUpUser(email, patientName, deviceId, signupSource, authDataId);
    return user;
  }

  async findOrSignUpUser(email: string, patientName: string, deviceId: string, signupSource: string, authDataId: string)
    : Promise<Parse.Object> {
    const user = await this.userDto.findUserByAuthDataId(authDataId);
    if (user) {
      return user;
    }
    return this.userDto.createNewUserObject(email, patientName, deviceId, signupSource, authDataId);
  }

  async setConcern(mainConcernId: string, _user: Parse.Object, option: Parse.FullOptions): Promise<any> {
    const mainConcern = await this.queryUtil
      .findOne(CollectionUtil.MainConcern, { where: { objectId: mainConcernId }, select: ['name', 'class'], option });
    if (!mainConcern) {
      return Promise.reject(new Error('No mainConcern found for this id'));
    }
    _user.set('activeConcern', mainConcern.get('name'));
    _user.set('activeConcernClass', mainConcern.get('class'));
    _user.set('currentNode', 'v1:');
    await _user.save({}, { useMasterKey: true });
    return this.queryUtil.findOne(CollectionUtil.User, { where: { objectId: _user.id }, option });
  }

  async fetchUser(user: Parse.Object, option: Parse.FullOptions): Promise<Parse.Object> {
    return this.userDto.fetchUser(user, option);
  }

  async validateToken(userId: string, option: Parse.FullOptions): Promise<Parse.Object> {
    return this.userDto.findUserByUsername(userId, option);
  }

  async findUserById(userId: string): Promise<any> {
    return this.userDto.findUserById(userId);
  }
}
