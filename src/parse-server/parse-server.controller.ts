import { Controller } from '@nestjs/common';
import { ParseServer } from 'parse-server';
import { env } from '../../config';

@Controller('parse-server')
export class ParseServerController {
  static generate(): ParseServer {
    const parseServerConfig: any = {
      databaseURI: env.MONGODB_URI,
      appId: env.APP_ID,
      enableAnonymousUsers: true,
      masterKey: env.MASTER_KEY,
      serverURL: `${env.SERVER_URL}/api/parse`,
      auth: {
        google: {
          id: 'user\'s Google id (string)',
          id_token: 'an authorized Google id_token for the user (use when not using access_token)',
          access_token: 'an authorized Google access_token for the user (use when not using id_token)',
        },
        apple: {
          id: 'user',
          token: 'the identity token for the user',
        },
        facebook: {
          id: 'user\'s Facebook id number as a string',
          access_token: 'an authorized Facebook access token for the user',
          expiration_date: 'token expiration date of the format: yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\'',
        },
        anonymous: {},
      },
    };

    parseServerConfig.databaseOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    switch (process.env.NODE_ENV) {
      case 'test': {
        parseServerConfig.logLevel = 'no_logging';
        break;
      }
      case 'production': {
        parseServerConfig.logLevel = 'error';
        break;
      }
      default:
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return new ParseServer(parseServerConfig);
  }
}
