import { Injectable } from '@nestjs/common';
import { UserResponseDto } from './dto/user-response.dto';
import { QueryUtil } from '../utils/query.util';

@Injectable()
export class UserResponseService {
  constructor(private queryUtil: QueryUtil,
              private userResponseDto: UserResponseDto) {}

  async saveUserResponse(user: Parse.Object, question: Parse.Object, answer: string, option: Parse.FullOptions): Promise<any> {
    const userResponse = await this.userResponseDto.findUserResponse(user, question, option);
    userResponse.set('answer', answer);
    let answerCopy = answer;
    if (question.get('evaluateAnswer') && question.get('uniqueIdentifier') === 'StateResidence') {
      answerCopy = ['Virginia', 'California', 'Maryland'].includes(answerCopy) ? 'CONTINUE' : 'SKIP';
    }

    if (question.get('evaluateAnswer') && question.get('uniqueIdentifier') === 'gender') {
      if (answer !== 'Male' && answer !== 'Female') {
        answerCopy = question.get('considerAs');
        answerCopy = answerCopy === 'Female' ? 'CONTINUE' : 'SKIP';
      } else {
        answerCopy = answer === 'Female' ? 'CONTINUE' : 'SKIP';
      }
    }

    if (question.get('evaluateAnswer') && question.get('uniqueIdentifier') === 'allergicToFollowing') {
      if (answer === 'None') {
        answerCopy = 'No';
      } else {
        answerCopy = 'Yes';
      }
    }
    // Lines below are pure hack and should be removed for the RX flow
    if (question.get('uniqueIdentifier') === 'ageRange') {
      answerCopy = 'ANY_ANY';
    }

    if (question.get('uniqueIdentifier') === 'PreviousMedications') {
      answerCopy = 'ANY_StateResidence^SKIP';
    }
    // After removing above lines change evaluateAnswer to

    if (question.get('evaluateAnswer')) {
      userResponse.set('evaluatedAnswer', `${question.get('uniqueIdentifier')}^${answerCopy}`);
    } else if (question.get('uniqueIdentifier') === 'ageRange' || question.get('uniqueIdentifier') === 'PreviousMedications') {
      // this else if block is to support non-rx hack please remove this when removing the above block for RX flow
      userResponse.set('evaluatedAnswer', answerCopy);
    } else {
      userResponse.set('evaluatedAnswer', 'ANY');
    }

    userResponse.set('node', user.get('currentNode'));
    return userResponse.save({}, option);
  }

  async findOrCreateUserResponse(user: Parse.Object, question: Parse.Object, option: Parse.FullOptions): Promise<Parse.Object> {
    let userResponse = await this.userResponseDto.findUserResponse(user, question, option);
    if (userResponse) {
      return userResponse;
    }
    userResponse = await this.userResponseDto.createUserResponse(user, question, option);
    return userResponse;
  }

  async getAllUserResponse(user: Parse.Object): Promise<Array<Parse.Object>> {
    return this.userResponseDto.findAllUserResponse(user);
  }
}
