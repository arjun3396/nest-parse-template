import { Injectable } from '@nestjs/common';
import { CollectionUtil, QueryUtil } from '../utils/query.util';
import { ConsultationSessionDto } from './dto/consultation-session.dto';
import { UserResponseService } from '../user-response/user-response.service';

@Injectable()
export class ConsultationSessionService {
  constructor(private queryUtil: QueryUtil,
              private consultationSessionDto: ConsultationSessionDto,
              private userResponseService: UserResponseService) {}

  async startConsultationSession(concernId: string, user: Parse.Object, option: Parse.FullOptions): Promise<{ [key: string]: any }> {
    const mainConcern = await this.queryUtil
      .findOne(CollectionUtil.MainConcern, { where: { objectId: concernId }, select: ['name', 'class'], option });
    const _user = await this.queryUtil.fetchObject(user, 'username', option);
    if (!mainConcern) {
      await Promise.reject(new Error('No mainConcern found for this id'));
    }
    await this.userResponseService.archiveUserResponse(_user, option);
    const consultationSession = await this.consultationSessionDto
      .createConsultationSession(mainConcern.get('name'), mainConcern.get('class'), _user, option);
    return { status: 'success', consultationSessionId: consultationSession.id };
  }

  async archiveConsultationsIfAny(user: Parse.Object, option: Parse.FullOptions)
    : Promise<any> {
    return this.consultationSessionDto.archiveConsultationsIfAny(user, option);
  }

  async findConsultationSession(user: Parse.Object, option: Parse.FullOptions): Promise<Parse.Object> {
    return this.consultationSessionDto.findConsultationSession(user, option);
  }
}
