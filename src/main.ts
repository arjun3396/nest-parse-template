import { NestFactory } from '@nestjs/core';
import ParseDashboard from 'parse-dashboard';
import { AppModule } from './app.module';
import { env } from '../config';
import { ParseServerController } from './parse-server/parse-server.controller';

async function bootstrap() {
  const parse = ParseServerController.generate();
  const app = await NestFactory.create(AppModule);
  const dashboard = new ParseDashboard({
    apps: [
      {
        serverURL: `${env.SERVER_URL}/api/parse`,
        appId: env.APP_ID,
        masterKey: env.MASTER_KEY,
        appName: env.APP_NAME,
      },
    ],
    users: env.parseAdminUser,
    useEncryptedPasswords: true,
  }, {
    allowInsecureHTTP: true,
    cookieSessionSecret: 'heallo-cookie-session-secret',
  });
  app.use('/api/parse', parse);
  app.use('/dashboard', dashboard);
  await app.listen(3000);
}
bootstrap();
