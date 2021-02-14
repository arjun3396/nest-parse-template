import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { EnvType } from '../types';

const root = path.normalize(`${__dirname}/..`);
const envFile = process.env.NODE_ENV === 'test' ? path.join(root, 'default.env') : path.join(root, '.env');
const setupCompleted = fs.existsSync(envFile);
if (!setupCompleted && process.env.NODE_ENV !== 'test') {
  fs.writeFileSync(envFile, '');
}

console.log(envFile);
const variables = setupCompleted ? dotenv.config({ path: envFile }) : dotenv.config({ path: path.join(root, 'default.env') });

const rawEnv: any = { ...variables.parsed || variables, ...process.env };

const aws: EnvType.AwsConfig = {
  accessKeyId: rawEnv.AWS_CONFIG_ACCESS_KEY_ID,
  secretAccessKey: rawEnv.AWS_CONFIG_SECRET_ACCESS_KEY,
  region: rawEnv.AWS_CONFIG_REGION,
  bucket: rawEnv.AWS_CONFIG_BUCKET,
};

const parseAdminUser: Array<EnvType.ParseAdminUser> = rawEnv.PARSE_SERVER_ADMIN_USERNAME_PASSWORD
  .split(',')
  .map((usernamePassword: string) => {
    const [user, pass]: Array<string> = usernamePassword.split(':');
    return { user, pass };
  });

const env: EnvType.EnvJson = {
  setupCompleted,
  parseAdminUser,
  envFile,
  root,
  ...rawEnv,
  awsConfig: aws,
  SERVER_URL: process.env.SERVER_URL || rawEnv.SERVER_URL,
  API_SERVER_URL: rawEnv.SERVER_URL,
  APP_ID: rawEnv.APP_ID,
  MASTER_KEY: rawEnv.MASTER_KEY,
  ...process.env,
};

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
export { env };
