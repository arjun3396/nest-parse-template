import { Injectable } from '@nestjs/common';

@Injectable()
export class QuestionDto {
  constructor(@inject(QueryUtil) private query: QueryUtil) {}

  async findQuestionById(objectId: string): Promise<Parse.Object> {
    const question = await this.query.findOne(CollectionUtil.Question, { where: { objectId }, option: { useMasterKey: true } });
    return question;
  }

  async createQuestionWithData(data: { [key: string]: any }): Promise<Parse.Object> {
    const question = new CollectionUtil.Question();
    Object.keys(data).forEach((key: string) => question.set(key, data[key]));
    return question.save({}, { useMasterKey: true });
  }
}
