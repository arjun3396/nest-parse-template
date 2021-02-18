import { Injectable } from '@nestjs/common';
import { CollectionUtil, QueryUtil } from '../../utils/query.util';

@Injectable()
export class InstantCheckupDto {
  constructor(private queryService: QueryUtil) {}

  async saveInstantCheckup(instantCheckup: { [key: string]: any }): Promise<Parse.Object> {
    const _instantCheckup = new CollectionUtil.InstantCheckup();
    return _instantCheckup.save(instantCheckup, { useMasterKey: true });
  }

  async findInstantCheckups(where: {[key: string]: any}, option: Parse.FullOptions): Promise<Array<Parse.Object>> {
    return this.queryService.find(CollectionUtil.InstantCheckup, {
      where,
      descending: 'createdAt',
      option,
      limit: 100,
    });
  }
}
