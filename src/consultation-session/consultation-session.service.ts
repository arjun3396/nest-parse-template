import { Injectable } from '@nestjs/common';
import { CollectionUtil, QueryUtil } from '../utils/query.util';
import { UserResponseDto } from '../user-response/dto/user-response.dto';
import { UserDto } from '../user/dto/user.dto';
import { ConsultationSessionDto } from './dto/consultation-session.dto';

@Injectable()
export class ConsultationSessionService {
  constructor(private queryUtil: QueryUtil,
              private userResponseDto: UserResponseDto,
              private userDto: UserDto,
              private consultationSessionDto: ConsultationSessionDto) {}

  async startConsultationSession(concernId: string, user: Parse.Object, option: Parse.FullOptions): Promise<{ [key: string]: any }> {
    const mainConcern = await this.queryUtil
      .findOne(CollectionUtil.MainConcern, { where: { objectId: concernId }, select: ['name', 'class'], option });
    const _user = await this.userDto.findUserById(user.id);
    if (!mainConcern) {
      await Promise.reject(new Error('No mainConcern found for this id'));
    }
    await this.userResponseDto.archiveUserResponse(_user, option);
    const consultationSession = await this.consultationSessionDto
      .createConsultationSession(mainConcern.get('name'), mainConcern.get('class'), _user, option);
    return { status: 'success', consultationSessionId: consultationSession.id };
  }
}
