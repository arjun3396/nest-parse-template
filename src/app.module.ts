import { Module } from '@nestjs/common';
import { ParseServerController } from './parse-server/parse-server.controller';
import { QueryService } from './query/query.service';
import { UserModule } from './user/user.module';
import { TreeModule } from './tree/tree.module';
import { QuestionModule } from './question/question.module';
import { ProductTypeModule } from './product-type/product-type.module';
import { ProductModule } from './product/product.module';
import { ProductBrandModule } from './product-brand/product-brand.module';
import { OrderModule } from './order/order.module';
import { NotificationModule } from './notification/notification.module';
import { MainConcernModule } from './main-concern/main-concern.module';
import { InstantCheckupModule } from './instant-checkup/instant-checkup.module';
import { HelpModule } from './help/help.module';
import { FavouriteModule } from './favourite/favourite.module';
import { CheckoutModule } from './checkout/checkout.module';
import { UserResponseModule } from './user-response/user-response.module';
import { PurchaseHistoryModule } from './purchase-history/purchase-history.module';
import { ConsultationSessionModule } from './consultation-session/consultation-session.module';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [UserModule, TreeModule, QuestionModule, ProductTypeModule, ProductModule, ProductBrandModule, OrderModule, NotificationModule, MainConcernModule, InstantCheckupModule, HelpModule, FavouriteModule, CheckoutModule, UserResponseModule, PurchaseHistoryModule, ConsultationSessionModule, UtilsModule],
  controllers: [ParseServerController],
  providers: [QueryService],
})
export class AppModule {}
