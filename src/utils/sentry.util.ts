import * as Sentry from '@sentry/node';
import { version } from '../../package.json';
import { DermtodoorError } from './dermtodoor-error.util';
import { env } from '../../config';

class SentryUtil {
  static Sentry: any = Sentry;

  static ErrorLevel: any = Sentry.Severity;

  static initialize(): void {
    Sentry.init({
      dsn: env.SENTRY_DSN,
      release: version,
      environment: env.DEPLOYMENT_ENVIRONMENT,
    });
  }

  static configureRequestScope(app: any): void {
    app.use((req: any, res: any, next: any) => {
      SentryUtil.Sentry.configureScope((scope: Sentry.Scope) => {
        scope.setLevel(Sentry.Severity.Error);
        const requestId: any = req.headers['x-request-id'];
        if (requestId) {
          scope.setTag('request_id', requestId);
        }
        req.headers.sentryScope = scope;
        next();
      });
    });
  }

  static captureException(error: DermtodoorError, sentryScope?: Sentry.Scope): void {
    if (error.skipSentry) {
      return;
    }
    if (error instanceof DermtodoorError && sentryScope) {
      sentryScope.setExtras(error.toJSON());
    }
    SentryUtil.Sentry.captureException(error, {}, sentryScope);
  }
}

export { SentryUtil };
