import { Injectable } from '@nestjs/common';
import { CollectionUtil } from '../utils/query.util';

@Injectable()
export class PurchaseHistoryService {
  async addPurchaseEntry(user: Parse.Object, product: Parse.Object): Promise<void> {
    const purchaseEntry = new CollectionUtil.PurchaseHistory();
    purchaseEntry.set('user', user);
    purchaseEntry.set('product', product);
    await purchaseEntry.save({}, { useMasterKey: true });
  }
}
