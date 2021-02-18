// <reference path="../index.d.ts" />
declare namespace EnvType {
  interface AwsConfig {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    bucket: string;
  }

  interface EnvJson {
    SHOPIFY_SHOPNAME: string;
    SHOPIFY_API_KEY: string;
    SHOPIFY_PASSWORD: string;
    STOREFRONT_API_KEY: string;
    SHOPIFY_GRAPHQL_ENDPOINT: string;
    STOREFRONT_GRAPHQL_ENDPOINT: string;
    DIETICIAN_ID: string;
    SERVICE_URL: string;
    NODE_ENV: string;
    DEPLOYMENT_ENVIRONMENT: string;
    REWARD_PRODUCTS: string;
    AFTER_PURCHASE_PRODUCT_OFFER_ID: string;
    ENABLE_MORGAN: string;
    SCHEDULER_USER_PASSWORD: string;
    ANDROID_SMS_HASH: string;
    DOT_P8_FILE_PATH: string;
    IOS_KEY_ID: string;
    IOS_TEAM_ID: string;
    PORT: string;
    MONGODB_URI: string;
    APP_ID: string;
    MASTER_KEY: string;
    REST_API_KEY: string;
    SERVER_URL: string;
    SMS_SERVICE: string;
    CASH_AMOUNT: string;
    GCS_PROJECT_ID: string;
    STORAGE_SERVICE: string;
    SNS_ACCESS_KEY_ID: string;
    SNS_SECRET: string;
    EVENT_SCHEDULER_SERVER_URL: string;
    EVENT_SCHEDULER_POLLING: string;
    EVENT_SCHEDULER_SENDING: string;
    SERVEO_URL: string;
    SALES_CALLER_ID: string;
    SALES_EMAIL_ID: string;
    SENTRY_DSN: string;
    UBUNTU_EMAIL_ID: string;
    TWILIO_FROM: string;
    API_SERVER_URL: string;
    DOCTOR_URL: string;
    WEB_APP_URL: string;
    FACEBOOK_PAGE_ACCESS_TOKEN: string;
    APP_NAME: string;
    PARSE_MOUNT: string;
    root: string;
    DEFAULT_DOCTOR_USERNAME: string;
    MIXPANEL_TOKEN: string;
    BRANCH_KEY: string;
    MAP_API_KEY: string;
    S3_AUDIO_BUCKET: string;
    S3_PRODUCT_BUCKET: string;
    S3_INVOICE_BUCKET: string;
    S3_PRESCRIPTION_BUCKET: string;
    S3_IMAGE_BUCKET: string;
    S3_OTHER_USER_FILES_BUCKET: string;
    WHITELISTED_DOMAINS: string;
    awsConfig: AwsConfig;
    parseAdminUser: Array<ParseAdminUser>;
    DELHIVERY_TRACKING_ID_REGEX: any;
    ECOMEXPRESS_TRACKING_ID_REGEX: any;
    Analytics: {
      Mixapnel: string;
      ElasticSearch: string;
      Facebook: string;
      Branch: string;
    };
    TRACKINGMORE_API_KEY: string;
    AFTERSHIP_API_KEY: string;
    DISABLE_AFTER_SAVE: string;
    DISABLE_BEFORE_SAVE: string;
    DISABLE_BEFORE_FIND: string;
    SEGMENT_KEY_API: string;
    SEGMENT_KEY_MASTER_SLAVE: string;
    SEGMENT_KEY_SCHEDULER: string;
  }

  interface ParseAdminUser {
    user: string;
    pass: string;
  }
}

export { EnvType };
