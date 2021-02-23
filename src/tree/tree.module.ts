import { Module } from '@nestjs/common';
import { TreeController } from './tree.controller';
import { TreeService } from './tree.service';
import { UtilsModule } from '../utils/utils.module';
import { UserResponseModule } from '../user-response/user-response.module';
import { ProductModule } from '../product/product.module';
import { CheckoutModule } from '../checkout/checkout.module';
import { MainConcernModule } from '../main-concern/main-concern.module';
import { UserModule } from '../user/user.module';
import { ConsultationSessionModule } from '../consultation-session/consultation-session.module';
import { QuestionModule } from '../question/question.module';

@Module({
  controllers: [TreeController],
  providers: [TreeService],
  imports: [
    UtilsModule,
    UserResponseModule,
    ProductModule,
    CheckoutModule,
    MainConcernModule,
    UserModule,
    QuestionModule,
    ConsultationSessionModule
  ]
})
export class TreeModule {}
