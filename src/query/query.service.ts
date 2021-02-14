import { Injectable } from '@nestjs/common';
import { MongoToParseQuery } from 'mongo-to-parse';
import { CollectionService } from '../collection/collection.service';

@Injectable()
class QueryService extends MongoToParseQuery { }

export { QueryService, CollectionService };
