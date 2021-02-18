import 'parse-server';
import { Injectable } from '@nestjs/common';

@Injectable()
class CollectionUtil {
  static User: new () => Parse.User = Parse.Object.extend('_User');

  static Question: new () => Parse.Object = Parse.Object.extend('Question');

  static Tree: new () => Parse.Object = Parse.Object.extend('Tree');

  static Cache: new () => Parse.Object = Parse.Object.extend('Cache');

  static ProductTypes: new () => Parse.Object = Parse.Object.extend('ProductTypes');

  static ProductBrands: new () => Parse.Object = Parse.Object.extend('ProductBrands');

  static MainConcern: new () => Parse.Object = Parse.Object.extend('MainConcerns');

  static InstantCheckup: new () => Parse.Object = Parse.Object.extend('InstantCheckup');

  static Favourite: new () => Parse.Object = Parse.Object.extend('Favourite');

  static Help: new () => Parse.Object = Parse.Object.extend('Help');

  static ConsultationSession: new () => Parse.Object = Parse.Object.extend('ConsultationSession');

  static UserResponse: new () => Parse.Object = Parse.Object.extend('UserResponse');

  static Product: new () => Parse.Object = Parse.Object.extend('Products');

  static Order: new () => Parse.Object = Parse.Object.extend('Order');

  static PushStatus: new () => Parse.Object = Parse.Object.extend('PushStatus');

  static Checkout: new () => Parse.Object = Parse.Object.extend('Checkout');

  static PurchaseHistory: new () => Parse.Object = Parse.Object.extend('PurchaseHistory');
}

export { CollectionUtil };
