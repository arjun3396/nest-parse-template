declare namespace ParseModelType {
  type ParseFunctionCallbackFunction = (req: Parse.Cloud.FunctionRequest, option: Parse.FullOptions) => Promise<any>;
  type ParseAfterSaveCallbackFunction = (req: Parse.Cloud.AfterSaveRequest, option: Parse.FullOptions) => Promise<any>;
}

export { ParseModelType };
