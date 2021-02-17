import { Module } from '@nestjs/common';
import { ParseServerController } from './parse-server/parse-server.controller';
import { QueryService } from './query/query.service';
import { UserModule } from './user/user.module';
import { TreeService } from './tree/tree.service';
import { TreeController } from './tree/tree.controller';
import { TreeModule } from './tree/tree.module';
import { QuestionModule } from './question/question.module';

@Module({
  imports: [UserModule, TreeModule, QuestionModule],
  controllers: [ParseServerController, TreeController],
  providers: [QueryService, TreeService],
})
export class AppModule {}
