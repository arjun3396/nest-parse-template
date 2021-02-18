declare interface DermtodoorErrorType {
  message: string;
  code: number;
  type: string;
  logMessage?: string;
  skipSentry?: boolean;
  params?: { [key: string]: any };
}

class DermtodoorError extends Error {
  readonly skipSentry: boolean;

  readonly code: number;

  private readonly type: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
  private readonly logMessage: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
  private readonly params: { [key: string]: any };

  constructor(error: DermtodoorErrorType) {
    super(error.message);
    Object.setPrototypeOf(this, DermtodoorError.prototype);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DermtodoorError);
    }
    this.name = error.type;
    this.code = error.code;
    this.type = error.type;
    this.params = error.params;
    this.logMessage = error.logMessage;
    this.skipSentry = error.skipSentry;
  }

  toJSON(): any {
    const jsonObj: any = { code: this.code, type: this.type, message: this.message };
    ['logMessage', 'skipSentry', 'params'].forEach((key: string) => {
      if (!this[key]) {
        return;
      }
      jsonObj[key] = this[key];
    });
    return jsonObj;
  }
}

export { DermtodoorError };
