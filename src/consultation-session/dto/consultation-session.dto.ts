import { Injectable } from '@nestjs/common';

@Injectable()
export class ConsultationSessionDto {
  constructor(@inject(QueryUtil) private queryUtil: QueryUtil) {}

  async createConsultationSession(concern: string, concernClass: string, _user: Parse.Object, option: Parse.FullOptions): Promise<any> {
    const user = await this.queryUtil.findOne(CollectionUtil.User, { where: { objectId: _user.id }, option });
    await this.archiveConsultationsIfAny(user, option);
    const consultationSession = new CollectionUtil.ConsultationSession();
    consultationSession.set('concern', concern);
    consultationSession.set('concernClass', concernClass);
    consultationSession.set('user', user);
    consultationSession.set('archive', false);
    return consultationSession.save({}, option);
  }

  async archiveConsultationsIfAny(user: Parse.Object, option: Parse.FullOptions)
    : Promise<any> {
    const allConsultations = await this.queryUtil
      .find(CollectionUtil.ConsultationSession, { where: { user, archive: false }, option });
    if (allConsultations.length) {
      allConsultations.map((consultationSession: Parse.Object) => consultationSession.save({ archive: true }, option));
      await Promise.all(allConsultations);
    }
    return { status: 'success' };
  }

  async findConsultationSession(user: Parse.Object, option: Parse.FullOptions): Promise<Parse.Object> {
    let consultationSession: Parse.Object;
    const _user = await this.queryUtil.findOne(CollectionUtil.User, { where: { objectId: user.id }, option });
    try {
      consultationSession = await this.queryUtil
        .findOne(CollectionUtil.ConsultationSession,
          { where: { user: _user, concern: _user.get('activeConcern'), concernClass: _user.get('activeConcernClass'), archive: false },
            option });
    } catch (error) {
      await Promise.reject(error);
    }
    return consultationSession;
  }
}
