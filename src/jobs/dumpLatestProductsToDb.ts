import { inject, injectable } from 'inversify';
import rp from 'request-promise';
import download from 'download';
import { ObjectID } from 'mongodb';
import fs from 'fs';
import schedule from 'node-schedule';
import readline from 'readline';
import _ from 'lodash';
import { container } from '../loaders/inversify';
import { EventEmitterUtil } from '../utils/eventEmitter.util';
import { env } from '../config';
import { MongoDBConnection } from '../utils/mongo-db-connection.util';
import { SentryUtil } from '../utils/sentry.util';

@injectable()
class DumpDataJob {
  constructor(@inject(MongoDBConnection) public mongoDBConnection: MongoDBConnection) {
    container.get(EventEmitterUtil).listenFor('dumpLatestProductsToParse', () => this.gotEvent());
    this.initialize();
  }

  initialize(): void {
    schedule.scheduleJob({ hour: 1, minute: 5 }, () => {
      this.gotEvent().catch((error) => Promise.reject(error));
    });
  }

    products: Array<{[key: string]: any}> = [];

    variants: Array<any> = [];

    readFile(): void {
      const lineReader = readline.createInterface({
        input: fs.createReadStream('./jobs/products.jsonl'),
      });
      lineReader.on('line', (line: any) => {
        const json = JSON.parse(line.trim());
        if (json.id.split('/')[3] === 'Product') {
          this.products.push(json);
        } else {
          this.variants.push(json);
        }
      })
        .on('close', (): void => {
          this.insertData().catch((error: any) => Promise.reject(error));
        });
    }

    async wait(timeMs: number): Promise<any> {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, timeMs);
      });
    }

    async insertData(): Promise<{[key: string]: any}> {
      try {
        let i = 0;
        this.products.forEach((product: any) => {
          this.products[i].variants = this.variants.filter((item) => product.id.split('/')[4] === item.__parentId.split('/')[4]);
          i += 1;
        });

        for (let j = 0; j < this.products.length; j += 1) {
          if (this.products[j].featuredImage) {
            // eslint-disable-next-line no-await-in-loop
            this.products[j].featuredImage.src = await this.getFeaturedImage(this.products[j].id.split('/')[4]);
          } else {
            // eslint-disable-next-line no-await-in-loop
            this.products[j].featuredImage = { src: await this.getFeaturedImage(this.products[j].id.split('/')[4]) };
          }
          // eslint-disable-next-line no-await-in-loop
          await this.wait(500);
        }
        this.getCleanProductsJson();
        await this.mongoDBConnection.connect();
        const oldProducts = await this.mongoDBConnection.db.collection('Products').find({}).toArray();
        const oldProductIds = oldProducts.map((product: any) => product._id);
        const latestProductsIds = this.products.map((product: any) => product._id);
        const newlyAddedProductIds = _.difference(latestProductsIds, oldProductIds);
        const removedProductIds = _.difference(oldProductIds, latestProductsIds);
        const newlyAddedProducts = this.products.filter((item: any) => newlyAddedProductIds.includes(item._id));
        const removedProducts = oldProducts.filter((item: any) => removedProductIds.includes(item._id));
        newlyAddedProducts.map((product: any) => {
          const _product = product;
          _product.tags.push('newarrivals');
          _product.variantIds = [];
          _product.variants = this.createProductsFromVariants(_product);
          _product.variants.forEach((variant: any) => _product.variantIds.push(variant.storefrontId));
          _product._created_at = new Date();
          _product._updated_at = new Date();
          _product.visible = !(_product.tags.includes('RX') || _product.tags.includes('discontinued'));
          return this.mongoDBConnection.db.collection('Products').insertOne(_product);
        });

        removedProducts
          .map((product: any) => this.mongoDBConnection.db.collection('Products').deleteOne({ _id: product._id }));
        await Promise.all([...newlyAddedProducts, ...removedProducts]);
        this.deleteFile();
      } catch (error) {
        SentryUtil.captureException(error);
        return Promise.reject(error);
      }
      return { status: 'success', message: 'Products data inserted successfully in database' };
    }

    deleteFile(): void {
      fs.exists('./jobs/products.jsonl', () => {
        fs.unlink('./jobs/products.jsonl', (error: any) => {
          if (error) { throw error; }
        });
      });
    }

    createProductsFromVariants(_product: { [key: string]: any }): { [key: string]: any } {
      let product = _product;
      product = product.variants.map((item: any) => ({
        objectId: product._id,
        id: product._id,
        vendor: product.vendor,
        title: product.title,
        description: product.description,
        descriptionHtml: product.descriptionHtml,
        productType: product.productType,
        imageSrc: product.imageSrc,
        price: item.price,
        storefrontId: item.storefrontId,
        weightUnit: item.weightUnit,
        weight: item.weight,
      }));
      return product;
    }

    async gotEvent(): Promise<{[key: string]: any}> {
      try {
        await this.createBulkOperation();
        await this.checkStatus();
        this.readFile();
      } catch (error) {
        SentryUtil.captureException(error);
        return Promise.reject(error);
      }
      return { status: 'success' };
    }

    async createBulkOperation(): Promise<{[key: string]: any}> {
      // eslint-disable-next-line max-len
      const query = 'mutation { bulkOperationRunQuery(query: "{ products { edges { node { id vendor title productType description tags descriptionHtml updatedAt featuredImage { src } storefrontId variants { edges { node { id price storefrontId weight weightUnit updatedAt } } } } } } }") { bulkOperation { id status } userErrors { field message } } }';
      let result: {[key: string]: any};
      try {
        result = await rp({
          method: 'POST',
          uri: env.SHOPIFY_GRAPHQL_ENDPOINT,
          body: { query },
          json: true,
        });
      } catch (err) {
        await Promise.reject(err);
      }
      return result;
    }

    async getFeaturedImage(productId: string): Promise<string> {
      const query = `query { products(first:1, query:"id:${productId}") { edges { node { featuredImage { src } } } } }`;
      let result;
      try {
        result = await rp({
          method: 'POST',
          uri: env.SHOPIFY_GRAPHQL_ENDPOINT,
          body: { query },
          json: true,
        });
      } catch (err) {
        await Promise.reject(err);
      }
      return result.data.products.edges[0].node.featuredImage
        ? result.data.products.edges[0].node.featuredImage.src as string
        : 'no-featured-image-present-for-this-product' as string;
    }

    async getBulkOperationStatus(): Promise<any> {
      const query = 'query { currentBulkOperation { id status errorCode createdAt completedAt objectCount fileSize url partialDataUrl } }';
      let result: {[key: string]: any};
      try {
        result = await rp({
          method: 'POST',
          uri: env.SHOPIFY_GRAPHQL_ENDPOINT,
          body: { query },
          json: true,
        });
      } catch (err) {
        await Promise.reject(err);
      }
      return result;
    }

    async checkStatus(): Promise<any> {
      const result = await this.getBulkOperationStatus();
      if (result.data.currentBulkOperation.status !== 'COMPLETED') {
        await this.wait(2000);
        return this.checkStatus();
      }
      const data = await download(result.data.currentBulkOperation.url);
      try {
        fs.writeFileSync('./jobs/products.jsonl', data);
      } catch (err) {
        await Promise.reject(err);
      }
      return true;
    }

    getCleanProductsJson(): any {
      try {
        this.products = this.products.map((item: any) => ({ _id: item.id.split('/')[4],
          title: item.title,
          vendor: item.vendor,
          tags: item.tags,
          description: item.description,
          descriptionHtml: item.descriptionHtml,
          productType: item.productType,
          imageSrc: item.featuredImage ? item.featuredImage.src : 'no-featured-image-present-for-this-product',
          variants: item.variants ? item.variants.map((variant: any) => ({
            id: variant.id,
            imageSrc: item.featuredImage ? item.featuredImage.src : 'no-featured-image-present-for-this-product',
            price: variant.price,
            storefrontId: variant.storefrontId,
            weight: variant.weight,
            weightUnit: variant.weightUnit,
          })) : [] }));
      } catch (error) {
        return Promise.reject(error);
      }
      return this.products;
    }
}

export { DumpDataJob };
