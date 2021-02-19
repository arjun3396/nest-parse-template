import { Injectable } from '@nestjs/common';
import { InstantCheckupDto } from './dto/instant-checkup.dto';
import { CollectionUtil, QueryUtil } from '../utils/query.util';
import { StorageUtil } from '../utils/storage.util';

@Injectable()
export class InstantCheckupService {
  constructor(private instantCheckupDto: InstantCheckupDto,
              private queryService: QueryUtil,
              private storageUtil: StorageUtil) {}

  async saveInstantCheckup(user: Parse.User, instantCheckup: Parse.Cloud.Params): Promise<Parse.Object> {
    let instantCheckupObj: Parse.Object;
    try {
      const _instantCheckup = instantCheckup;
      if (!user.get('type')) {
        _instantCheckup.userId = user.getUsername();
      }
      try {
        instantCheckupObj = await this.instantCheckupDto.saveInstantCheckup(instantCheckup);
      } catch (error) {
        await Promise.reject(error);
      }
    } catch (err) {
      await Promise.reject(err);
    }
    return instantCheckupObj;
  }

  async deleteInstantCheckup(user: Parse.Object, instantCheckupId: string, option: Parse.FullOptions): Promise<{[key: string]: any}> {
    try {
      try {
        const where = { userId: user.get('username'), objectId: instantCheckupId };
        const instantCheckupObjects = await this.instantCheckupDto.findInstantCheckups(where, option);
        await instantCheckupObjects[0].destroy(option);
      } catch (error) {
        await Promise.reject(error);
      }
    } catch (err) {
      await Promise.reject(err);
    }
    return { status: 'success', message: `InstantCheckup with objectId: ${instantCheckupId} deleted successfully` };
  }

  async getPreviousInstantCheckups(option: Parse.FullOptions, username: string, instantCheckupId?: string): Promise<Array<Parse.Object>> {
    try {
      const where: { user?: Parse.Object; objectId?: string; imagePath?: string } = {};
      if (instantCheckupId) { where.objectId = instantCheckupId; }
      if (username) {
        const user = await this.queryService.findOne(CollectionUtil.User, { where: { username }, option });
        if (user) where.user = user;
      }

      return this.instantCheckupDto.findInstantCheckups(where, option);
    } catch (error) {
      await Promise.reject(error);
    }
    return undefined;
  }

  async signInstantCheckupURLResolver(item: Parse.Object): Promise<{ [key: string]: any }> {
    const instantCheckupJSON: { [key: string]: any } = item.toJSON();
    instantCheckupJSON.imagePath = await this.storageUtil
      .generateSignedUrlFromPublicUrl(instantCheckupJSON.imagePath);
    if (instantCheckupJSON.compressedImagePath) {
      instantCheckupJSON.compressedImagePath = await this.storageUtil
        .generateSignedUrlFromPublicUrl(instantCheckupJSON.compressedImagePath);
    }
    if (instantCheckupJSON.thumbnailImagePath) {
      instantCheckupJSON.thumbnailImagePath = await this.storageUtil
        .generateSignedUrlFromPublicUrl(instantCheckupJSON.thumbnailImagePath);
    }
    return instantCheckupJSON;
  }

  async signInstantCheckupURL(instantCheckups: Array<Parse.Object>): Promise<Array<{ [key: string]: any }>> {
    const mappedInstantCheckups = await Promise
      .all(instantCheckups.map(async (item: Parse.Object) => this.signInstantCheckupURLResolver(item)));
    return mappedInstantCheckups;
  }

  async findInstantCheckups(where: {[key: string]: any}, option: Parse.FullOptions): Promise<Array<Parse.Object>> {
    return this.instantCheckupDto.findInstantCheckups(where, option);
  }
}
