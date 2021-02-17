import { Module } from '@nestjs/common';
import { ParseServerController } from './parse-server/parse-server.controller';
import { QueryService } from './query/query.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule],
  controllers: [ParseServerController],
  providers: [QueryService],
})
export class AppModule {}
