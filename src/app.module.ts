import { Module } from '@nestjs/common';
import { ParseServerController } from './parse-server/parse-server.controller';
import { QueryService } from './query/query.service';

@Module({
  imports: [],
  controllers: [ParseServerController],
  providers: [QueryService],
})
export class AppModule {}
