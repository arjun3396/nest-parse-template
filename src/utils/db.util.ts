import { inject, injectable } from 'inversify';
import { MongoDBConnection } from './mongo-db-connection.util';

@injectable()
class DB {
  constructor(@inject(MongoDBConnection) public mongoDBConnection: MongoDBConnection) {}

  async connect(): Promise<any> {
    await this.mongoDBConnection.connect();
  }

  async waitForConnectionToEstablish(): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return new Promise((resolve: Function, reject: Function): void => {
      let maxRetries = 10;
      const interval = setInterval((): void => {
        if (!maxRetries) {
          clearInterval(interval);
          reject(new Error('unable to establish connection with mongodb'));
        }
        if (!this.mongoDBConnection.isConnected()) {
          maxRetries -= 1;
        }
        clearInterval(interval);
        resolve();
      }, 500);
    });
  }

  async find(ParseTable: new () => Parse.Object, query: {[key: string]: any}): Promise<Array<any>> {
    return this.mongoDBConnection.find(new ParseTable().className, query);
  }

  async findOne(ParseTable: new () => Parse.Object, query: {[key: string]: any}): Promise<any> {
    return this.mongoDBConnection.findOne(new ParseTable().className, query);
  }
}

export { DB };
