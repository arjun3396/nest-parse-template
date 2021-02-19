import { CollectionService } from '../../collection/collection.service';
import { Injectable } from '@nestjs/common';

@Injectable()
class HelpModel {
  async createHelpWithData(data: {[key: string]: any}, user: Parse.Object): Promise<Parse.Object> {
    const help = new CollectionService.Help();
    Object.keys(data).forEach((key: string) => help.set(key, data[key]));
    help.set('user', user);
    help.set('completed', false);
    return help.save({}, { useMasterKey: true });
  }
}

export { HelpModel };
