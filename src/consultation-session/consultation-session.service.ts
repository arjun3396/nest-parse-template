import { Injectable } from '@nestjs/common';

@Injectable()
export class ConsultationSessionService {
  constructor(@inject(QueryUtil) private queryUtil: QueryUtil,
              @inject(UserResponseModel) private userResponseModel: UserResponseModel,
              @inject(UserModel) private userModel: UserModel,
              @inject(ConsultationSessionModel) private consultationSessionModel: ConsultationSessionModel) {}

  async startConsultationSession(concernId: string, user: Parse.Object, option: Parse.FullOptions): Promise<{ [key: string]: any }> {
    const mainConcern = await this.queryUtil
      .findOne(CollectionUtil.MainConcern, { where: { objectId: concernId }, select: ['name', 'class'], option });
    const _user = await this.userModel.findUserById(user.id);
    if (!mainConcern) {
      await Promise.reject(new Error('No mainConcern found for this id'));
    }
    await this.userResponseModel.archiveUserResponse(_user, option);
    const consultationSession = await this.consultationSessionModel
      .createConsultationSession(mainConcern.get('name'), mainConcern.get('class'), _user, option);
    return { status: 'success', consultationSessionId: consultationSession.id };
  }
}
