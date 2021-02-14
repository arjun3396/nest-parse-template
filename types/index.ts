// <reference path="../index.d.ts" />
declare namespace EnvType {
  interface AwsConfig {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    bucket: string;
  }

  interface EnvJson {
    PARSE_SERVER_ADMIN_USERNAME_PASSWORD: string;
    SERVICE_URL: string;
    NODE_ENV: string;
    DEPLOYMENT_ENVIRONMENT: string;
    ENABLE_MORGAN: string;
    PORT: string;
    MONGODB_URI: string;
    APP_ID: string;
    MASTER_KEY: string;
    REST_API_KEY: string;
    SERVER_URL: string;
    GCS_PROJECT_ID: string;
    STORAGE_SERVICE: string;
    SENTRY_DSN: string;
    DOCTOR_URL: string;
    WEB_APP_URL: string;
    APP_NAME: string;
    PARSE_MOUNT: string;
    root: string;
    WHITELISTED_DOMAINS: string;
    awsConfig: AwsConfig;
    parseAdminUser: Array<ParseAdminUser>;
    DISABLE_AFTER_SAVE: string;
    DISABLE_BEFORE_SAVE: string;
    DISABLE_BEFORE_FIND: string;
  }

  interface ParseAdminUser {
    user: string;
    pass: string;
  }
}

export { EnvType };
