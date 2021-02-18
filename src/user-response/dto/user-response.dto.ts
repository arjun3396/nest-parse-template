import { Injectable } from '@nestjs/common';
import { CollectionUtil, QueryUtil } from '../../utils/query.util';

@Injectable()
export class UserResponseDto {
  constructor(private queryUtil: QueryUtil) {}

  async createUserResponse(user: Parse.Object, question: Parse.Object, option: Parse.FullOptions): Promise<Parse.Object> {
    const userResponseCount = await this.queryUtil
      .count(CollectionUtil.UserResponse,
        { where: { user, concern: user.get('activeConcern'), concernClass: user.get('activeConcernClass'), archive: false },
          option }) as number;
    const userResponse = new CollectionUtil.UserResponse();
    userResponse.set('user', user);
    userResponse.set('concern', user.get('activeConcern'));
    userResponse.set('concernClass', user.get('activeConcernClass'));
    userResponse.set('question', question);
    userResponse.set('questionTitle', question.get('title'));
    userResponse.set('questionNumber', userResponseCount + 1);
    userResponse.set('questionUniqueIdentifier', question.get('uniqueIdentifier'));
    userResponse.set('archive', false);
    return userResponse.save({}, option);
  }

  async findUserResponse(user: Parse.Object, question: Parse.Object, option: Parse.FullOptions): Promise<Parse.Object> {
    const userResponse = await this.queryUtil
      .findOne(CollectionUtil.UserResponse,
        { where: { user, question, concern: user.get('activeConcern'), concernClass: user.get('activeConcernClass'), archive: false },
          include: ['question'],
          option });
    return userResponse;
  }

  async findAllUserResponse(user: Parse.Object): Promise<Array<Parse.Object>> {
    const userResponses = await this.queryUtil
      .find(CollectionUtil.UserResponse,
        { where: { user, concern: user.get('activeConcern'), concernClass: user.get('activeConcernClass'), archive: false },
          include: ['question'],
          ascending: 'questionNumber',
          option: { useMasterKey: true } });
    return userResponses;
  }

  async archiveUserResponse(user: Parse.Object, option: Parse.FullOptions)
    : Promise<any> {
    const userResponses = await this.queryUtil
      .find(CollectionUtil.UserResponse,
        { where: { user, archive: false },
          include: ['question'],
          ascending: 'questionNumber',
          option: { useMasterKey: true } });
    console.log('MONITOR archiveUserResponse before delete', userResponses, userResponses.length);
    if (!userResponses.length) { return { status: 'success' }; }
    const promises = [];
    userResponses.forEach((response: Parse.Object) => promises.push(response.save({ archive: true }, option)));
    await Promise.all(promises);
    return { status: 'success' };
  }
}

