// eslint-disable-next-line import/no-extraneous-dependencies
import 'reflect-metadata';
import { injectable } from 'inversify';
import { ParseModelType } from '../types/parse-model';

@injectable()
class AuthUtil {
  getMasterOption(option: Parse.FullOptions): Parse.FullOptions {
    const masterOption: Parse.FullOptions = { useMasterKey: true };
    return { ...masterOption, sessionToken: option.sessionToken };
  }

  isAuthenticatedRequest = (request: Parse.Cloud.FunctionRequest | Parse.Cloud.AfterFindRequest)
    : boolean => !!(request.user || request.master);

  unauthenticatedCloudFunction = (name: string, callback: ParseModelType.ParseFunctionCallbackFunction): void => {
    Parse.Cloud.define(name, async (req: Parse.Cloud.FunctionRequest) => this.handleCallback(req, callback));
  };

  authenticatedCloudFunction = (name: string, callback: ParseModelType.ParseFunctionCallbackFunction): void => {
    Parse.Cloud.define(name, async (req: Parse.Cloud.FunctionRequest) => {
      if (!this.isAuthenticatedRequest(req)) {
        throw new Parse.Error(401, 'Unauthorized Access.');
      }
      return this.handleCallback(req, callback);
    });
  };

  getOption = (request: Parse.Cloud.FunctionRequest): Parse.FullOptions => {
    const option: Parse.FullOptions = { useMasterKey: !!request.master };
    if (request.user) {
      option.sessionToken = request.user.getSessionToken();
    }
    return option;
  };

  afterSave(Collection: new () => Parse.Object, callback: ParseModelType.ParseAfterSaveCallbackFunction): void {
    Parse.Cloud.afterSave(new Collection().className, async (req: any) => this.handleCallback(req, callback));
  }

  beforeSave(Collection: new () => Parse.Object, callback: ParseModelType.ParseAfterSaveCallbackFunction): void {
    Parse.Cloud.beforeSave(new Collection().className, async (req: any) => this.handleCallback(req, callback));
  }

  handleCallback = async (request: Parse.Cloud.FunctionRequest, callback: (req: any, option: Parse.FullOptions) =>
    Promise<any>): Promise<any> => {
    try {
      return await callback(request, this.getOption(request));
    } catch (error) {
      throw new Parse.Error(error.code || 400, error.params || error.message || error);
    }
  };
}

export { AuthUtil };
