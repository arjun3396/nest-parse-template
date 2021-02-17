import { Injectable } from '@nestjs/common';

@Injectable()
export class MainConcernService {
  constructor(@inject(QueryUtil) private queryUtil: QueryUtil) {}

  async addMainConcern(concern: string, concernClass: string): Promise<{ [key: string]: any }> {
    const mainConcern = new CollectionUtil.MainConcern();
    mainConcern.set('name', concern);
    mainConcern.set('class', concernClass);
    await mainConcern.save({}, { useMasterKey: true });
    return { result: 'success', mainConcernId: mainConcern.id };
  }

  async getAllMainConcern(): Promise<Array<Parse.Object>> {
    const allMainConcerns = await this.queryUtil.find(CollectionUtil.MainConcern, { where: {}, select: ['name', 'class', 'value'] });
    return allMainConcerns;
  }

  async getConcernByName(name: string): Promise<Parse.Object> {
    const mainConcern = await this.queryUtil
      .findOne(CollectionUtil.MainConcern, { where: { name }, select: ['name', 'class', 'value', 'rxNotAvailable'] });
    return mainConcern;
  }
}
