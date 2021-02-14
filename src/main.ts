import { NestFactory } from '@nestjs/core';
import ParseDashboard from 'parse-dashboard';
import { AppModule } from './app.module';
import { env } from '../config';

async function bootstrap() {
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
  app.use('/dashboard', dashboard);
  await app.listen(3000);
}
bootstrap();
