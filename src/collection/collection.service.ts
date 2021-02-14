import { Injectable } from '@nestjs/common';

@Injectable()
class CollectionService {
  static User: new () => Parse.User = Parse.Object.extend('_User');
}

export { CollectionService };
