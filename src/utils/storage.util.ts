import aws from 'aws-sdk';
import { injectable } from 'inversify';
import { env } from '../config';

@injectable()
class StorageUtil {
  private _s3: any;

  constructor() {
    this._s3 = new aws.S3({ signatureVersion: 'v4', ...env.awsConfig });
  }

  extractKeyAndBucketFromUrl(url: string): [string, string] {
    const urlSplit = url.split('/');
    const key = urlSplit.pop();
    const bucket = urlSplit.pop();
    return [key, bucket];
  }

  async createGetPreSignedURL({ Key, Bucket, Expires = 3600 }: { Key: string, Bucket: string, Expires: number}): Promise<string> {
    const signedURL = await this._s3.getSignedUrl('getObject', { Bucket, Key, Expires });
    return signedURL;
  }

  async generateSignedUrlFromPublicUrl(url: string): Promise<any> {
    const [Key, Bucket]: [string, string] = this.extractKeyAndBucketFromUrl(url);
    const params: any = { Key, Bucket, url };
    let signedUrl: string;
    try {
      signedUrl = await this.createGetPreSignedURL(params);
    } catch (error) {
      await Promise.reject(error);
    }
    return signedUrl;
  }
}

export { StorageUtil };
