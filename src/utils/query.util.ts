import { MongoToParseQuery } from 'mongo-to-parse';
import { CollectionUtil } from './collection.util';
import { Injectable } from '@nestjs/common';

@Injectable()
class QueryUtil extends MongoToParseQuery { }

export { QueryUtil, CollectionUtil };
