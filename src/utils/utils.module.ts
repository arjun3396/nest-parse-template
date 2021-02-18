import { Module } from '@nestjs/common';
import { AuthUtil } from './auth.util';
import { CollectionUtil } from './collection.util';
import { DB } from './db.util';
import { DermtodoorError } from './dermtodoor-error.util';
import { MongoDBConnection } from './mongo-db-connection.util';
import { QueryUtil } from './query.util';
import { Tree } from './tree.util';

@Module({
  providers: [AuthUtil, CollectionUtil, DB, MongoDBConnection, QueryUtil, Tree]
})
export class UtilsModule {}
