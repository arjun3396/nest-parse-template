import { Injectable } from '@nestjs/common';

@Injectable()
export class UserDto {
  constructor(@inject(QueryUtil) private queryUtil: QueryUtil) {}

  getUserPointer(objectId: string): any {
    return this.queryUtil.getPointerFromId(objectId, CollectionUtil.User);
  }

  async findUserById(objectId: string): Promise<any> {
    const user = await this.queryUtil.findOne(CollectionUtil.User, { where: { objectId }, option: { useMasterKey: true } });
    return user;
  }

  async findUserByUsername(username: string, option: Parse.FullOptions): Promise<any> {
    const user = await this.queryUtil.findOne(CollectionUtil.User, { where: { username }, option });
    return user;
  }

  async fetchUser(user: Parse.Object, option: Parse.FullOptions): Promise<Parse.User> {
    const _user = await this.queryUtil.fetchObject(user, 'username', option) as Parse.User;
    return _user;
  }

  async findUserByAuthDataId(username: string): Promise<Parse.Object> {
    return this.queryUtil.findOne(CollectionUtil.User, { where: { username }, option: { useMasterKey: true } });
  }

  async findUserByEmail(userEmail: string): Promise<Parse.Object> {
    return this.queryUtil.findOne(CollectionUtil.User, { where: { userEmail }, option: { useMasterKey: true } });
  }

  async createNewUserObject(email: string, patientName: string, deviceId: string, signupSource: string, authDataId: string):
    Promise<Parse.User> {
    const newUserObject = new CollectionUtil.User();
    newUserObject.setUsername(authDataId);
    newUserObject.set('userEmail', email);
    this.createNewPassword(newUserObject);
    await newUserObject.signUp({ deviceId, signupSource, patientName }, { useMasterKey: true });
    return newUserObject;
  }

  private createNewPassword(user: any): void {
    const password = Math.random().toString(36).substring(2);
    user.set('password', password);
  }
}
