import { Module } from '@nestjs/common';
import { AuthUtil } from './auth.util';
import { CollectionUtil } from './collection.util';
import { DB } from './db.util';
import { MongoDBConnection } from './mongo-db-connection.util';
import { QueryUtil } from './query.util';
import { Tree } from './tree.util';
import { EventEmitterUtil } from './eventEmitter.util';
import { SentryUtil } from './sentry.util';
import { StorageUtil } from './storage.util';

@Module({
  providers: [AuthUtil, CollectionUtil, DB, MongoDBConnection, QueryUtil, Tree, EventEmitterUtil, SentryUtil, StorageUtil],
  exports: [QueryUtil, StorageUtil, Tree, AuthUtil, EventEmitterUtil, SentryUtil],
})
export class UtilsModule {}
