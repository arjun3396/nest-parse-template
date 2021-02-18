import { Db, MongoClient } from 'mongodb';
import { env } from '../../config';
import { Injectable } from '@nestjs/common';

@Injectable()
class MongoDBConnection {
    private static DB_NAME: string = env.MONGODB_URI.split('?')[0].split('/').pop();

    client: MongoClient;

    dbDropStatus = false;

    isConnected(): boolean {
      return !!this.client && this.client.isConnected();
    }

    get db(): Db {
      return this.client.db(MongoDBConnection.DB_NAME);
    }

    async connect(): Promise<any> {
      if (this.isConnected()) {
        return this.client;
      }
      let client: MongoClient;
      if (!this.client) {
        const options: any = {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        };

        // if (env.ssl.db.enable) {
        //     options = {
        //         ...options,
        //         socketTimeoutMS: 20000,
        //         ssl: true,
        //         sslValidate: true,
        //         sslCA: fs.readFileSync(env.ssl.db.ca),
        //         sslCert: fs.readFileSync(env.ssl.db.cert),
        //         sslKey: fs.readFileSync(env.ssl.db.key),
        //     };
        // }

        client = new MongoClient(env.MONGODB_URI, options);
      } else {
        ({ client } = this);
      }
      this.client = await client.connect();
      return this.client;
    }

    async find(tableName: string, query: any = {}): Promise<Array<Parse.Object>> {
      await this.connect();
      // eslint-disable-next-line @typescript-eslint/ban-types
      return new Promise((resolve: Function, reject: Function) => {
        this.db.collection(tableName).find(query).toArray((error, items) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(items);
        });
      });
    }

    async findOne(tableName: string, query: any = {}): Promise<any> {
      await this.connect();
      // eslint-disable-next-line @typescript-eslint/ban-types
      return new Promise((resolve: Function, reject: Function) => {
        this.db.collection(tableName).findOne(query, (error, item) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(item);
        });
      });
    }

    async dropDb(): Promise<any> {
      await this.connect();
      return this.db.dropDatabase();
    }
}

export { MongoDBConnection };
