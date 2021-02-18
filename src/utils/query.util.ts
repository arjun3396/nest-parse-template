import { injectable } from 'inversify';
import { MongoToParseQuery } from 'mongo-to-parse';
import { CollectionUtil } from './collection.util';

@injectable()
class QueryUtil extends MongoToParseQuery { }

export { QueryUtil, CollectionUtil };
