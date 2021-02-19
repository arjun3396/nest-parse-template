import { Injectable } from '@nestjs/common';

@Injectable()
class CollectionService {
  static User: new () => Parse.User = Parse.Object.extend('_User');
  static Help: new () => Parse.User = Parse.Object.extend('Help');
}

export { CollectionService };
