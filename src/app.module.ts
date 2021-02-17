import { Module } from '@nestjs/common';
import { ParseServerController } from './parse-server/parse-server.controller';
import { QueryService } from './query/query.service';
import { UserModule } from './user/user.module';
import { TreeService } from './tree/tree.service';
import { TreeController } from './tree/tree.controller';
import { TreeModule } from './tree/tree.module';
import { QuestionModule } from './question/question.module';
import { ProductTypeModule } from './product-type/product-type.module';
import { ProductModule } from './product/product.module';
import { ProductBrandModule } from './product-brand/product-brand.module';
import { ProductBranchService } from './product-branch/product-branch.service';
import { OrderModule } from './order/order.module';
import { NotificationModule } from './notification/notification.module';
import { MainConcernModule } from './main-concern/main-concern.module';
import { InstantCheckupModule } from './instant-checkup/instant-checkup.module';
import { HelpModule } from './help/help.module';

@Module({
  imports: [UserModule, TreeModule, QuestionModule, ProductTypeModule, ProductModule, ProductBrandModule, OrderModule, NotificationModule, MainConcernModule, InstantCheckupModule, HelpModule],
  controllers: [ParseServerController, TreeController],
  providers: [QueryService, TreeService, ProductBranchService],
})
export class AppModule {}
