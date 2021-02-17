import { Injectable } from '@nestjs/common';

@Injectable()
export class HelpService {
  constructor(@inject(HelpModel) private helpModel: HelpModel) {}

  async addHelpIfRequireParamsExists(body: {[key: string]: any}, user: Parse.Object): Promise<Parse.Object> {
    if (this.areRequiredParamsMissing(body)) {
      return Promise.reject(this.whichParamsAreMissing(body));
    }
    return this.helpModel.createHelpWithData(body, user);
  }

  areRequiredParamsMissing(body: {[key: string]: any}): boolean {
    return !body.name || !body.email || !body.mobileNumber || !body.orderNumber || !body.message;
  }

  whichParamsAreMissing(body: {[key: string]: any}): string {
    const requiredParams = ['name', 'email', 'mobileNumber', 'orderNumber', 'message'];
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
