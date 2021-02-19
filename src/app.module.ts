import { Module } from '@nestjs/common';
import { ParseServerController } from './parse-server/parse-server.controller';
import { QueryService } from './query/query.service';
import { HelpController } from './help/help.controller';
import { HelpService } from './help/help.service';
import { HelpModule } from './help/help.module';
import { SentryService } from './sentry/sentry.service';
import { ErrorService } from './error/error.service';
import { AuthService } from './auth/auth.service';
import { HelpModel } from './help/dto/help.model';

@Module({
  imports: [HelpModule],
  controllers: [ParseServerController],
  providers: [QueryService, HelpService, SentryService, AuthService, HelpModel],
})
export class AppModule {}
