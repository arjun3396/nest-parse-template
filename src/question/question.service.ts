import { Injectable } from '@nestjs/common';

@Injectable()
export class QuestionService {
  constructor(@inject(QuestionModel) private questionModel: QuestionModel) {}

  async addQuestionIfRequireParamsExists(body: {[key: string]: any}): Promise<Parse.Object> {
    if (this.areRequiredParamsMissing(body)) {
      await Promise.reject(this.whichParamsAreMissing(body));
    }
    return this.questionModel.createQuestionWithData(body);
  }

  areRequiredParamsMissing(body: {[key: string]: any}): boolean {
    return !body.uniqueIdentifier || !body.title || !body.inputs || !body.type || !body.table;
  }

  whichParamsAreMissing(body: {[key: string]: any}): string {
    const requiredParams = ['uniqueIdentifier', 'title', 'inputs', 'type', 'table'];
    let missingParams: string = 'These required params are missing: ';
    const keysInBody = Object.keys(body);
    requiredParams.forEach((key: string) => {
      if (!keysInBody.includes(key)) {
        missingParams += `${key} `;
      }
    });
    return missingParams;
  }
}
