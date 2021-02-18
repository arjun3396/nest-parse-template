import { Module } from '@nestjs/common';
import { PurchaseHistoryService } from './purchase-history.service';

@Module({
  providers: [PurchaseHistoryService]
})
export class PurchaseHistoryModule {}
