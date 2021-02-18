import { Injectable } from '@nestjs/common';
import { Tree } from '../utils/tree.util';
import { CollectionUtil, QueryUtil } from '../utils/query.util';
import { UserResponseService } from '../user-response/user-response.service';
import { ProductService } from '../product/product.service';
import { CheckoutService } from '../checkout/checkout.service';
import { MainConcernService } from '../main-concern/main-concern.service';
import { ConsultationSessionDto } from '../consultation-session/dto/consultation-session.dto';
import { QuestionDto } from '../question/dto/question.dto';
import { UserDto } from '../user/dto/user.dto';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const regimenMap = require('../regimenTagMap');

@Injectable()
export class TreeService {
  tree: any = {};

  constructor(private treeUtil: Tree,
              private userModel: UserDto,
              private questionDto: QuestionDto,
              private queryUtil: QueryUtil,
              private userResponseService: UserResponseService,
              private productService: ProductService,
              private checkoutService: CheckoutService,
              private mainConcernService: MainConcernService,
              private consultationSessionDto: ConsultationSessionDto) {}

  async createAndStoreTree(): Promise<any> {
    const [tree] = await this.treeUtil.initialize();
    this.tree = tree;
  }

  async storeUserResponseToQuestion(answer: string, user: Parse.Object, option: Parse.FullOptions): Promise<{[key: string]: any}> {
    const _user = await this.queryUtil.findOne(CollectionUtil.User, { where: { objectId: user.id }, option });
    const { questionId } = this.tree[_user.get('currentNode')];
    const question = await this.questionDto.findQuestionById(questionId);
    if (question.get('table') === '_User') {
      _user.set(question.get('uniqueIdentifier'), answer);
    }
    const consultationSession = await this.consultationSessionDto.findConsultationSession(_user, option);
    consultationSession.set(question.get('uniqueIdentifier'), answer);
    await consultationSession.save({}, option);

    const userResponse = await this.userResponseService.saveUserResponse(_user, question, answer, option);
    _user.set('previousNode', _user.get('currentNode'));
    _user.set('currentNode', this.tree[_user.get('currentNode')].redirect._default
      ? this.tree[_user.get('currentNode')].redirect._default
      : 'treeCompleted');
    if (userResponse.get('evaluatedAnswer').includes('SKIP') && question.get('uniqueIdentifier') === 'gender') {
      _user.set('previousNode', _user.get('currentNode'));
      _user.set('currentNode', this.tree[_user.get('currentNode')].redirect._default
        ? this.tree[_user.get('currentNode')].redirect._default
        : 'treeCompleted');
    }
    await _user.save({}, { useMasterKey: true });
    return { status: 'success', message: 'user response saved successfully' };
  }

  async getNextTreeNode(user: Parse.Object, option: Parse.FullOptions): Promise<{[key: string]: any}> {
    console.log('MONITOR getNextTreeNode', user.get('activeConcern'), user.get('activeConcernClass'));
    const _user = await this.userModel.findUserById(user.id);
    console.log('MONITOR getNextTreeNode after fetch', _user.get('activeConcern'), _user.get('activeConcernClass'));
    if (!this.tree[_user.get('currentNode')]) {
      const regimenTag = await this.getRegimenTag(_user);
      const consultationSession = await this.consultationSessionDto.findConsultationSession(_user, option);
      consultationSession.set('regimenTag', regimenTag);
      consultationSession.save({}, option)
        .catch((error) => Promise.reject(error));

      const productsByTag: Array<{[key: string]: any}> = await this.productService.getProductsByTagForTreeResponse(regimenTag);
      const checkout = await this.checkoutService.addProductsSuggestByTreeToCheckout(productsByTag, _user, option);
      return { question: undefined, treeCompleted: true, checkoutCreated: !!checkout };
    }
    const nextQuestionId = this.tree[_user.get('currentNode')].questionId;
    const question = await this.questionDto.findQuestionById(nextQuestionId);
    const mainConcern = await this.mainConcernService.getConcernByName(_user.get('activeConcern'));
    if (question.get('uniqueIdentifier') === 'RxOrNonRx' && mainConcern && mainConcern.get('rxNotAvailable')) {
      await this.storeUserResponseToQuestion('Non-Rx', _user, option);
      return this.getNextTreeNode(_user, option);
    }
    const userResponse = await this.userResponseService.findOrCreateUserResponse(_user, question, option);
    return { question: userResponse, treeCompleted: false };
  }

  async getPreviousTreeNode(user: Parse.Object, option: Parse.FullOptions): Promise<{[key: string]: any}> {
    const _user = await this.queryUtil.findOne(CollectionUtil.User, { where: { objectId: user.id }, option });
    const allUserResponse = await this.userResponseService.getAllUserResponse(_user);
    if (allUserResponse.length) {
      const currentUserResponse = allUserResponse.pop();
      await currentUserResponse.destroy({ useMasterKey: true });
    }

    const userResponse = allUserResponse.slice(-1).pop();
    if (!userResponse) {
      _user.set('currentNode', 'v1:');
      await _user.save({}, option);
      return { treeCompleted: false };
    }
    _user.set('currentNode', userResponse.get('node'));
    await _user.save({}, option);
    return { question: userResponse, treeCompleted: false };
  }

  async getRegimenTag(user: Parse.Object): Promise<string> {
    const allUserResponse = await this.userResponseService.getAllUserResponse(user);
    const evaluatedResponse = [];
    const concernObj = await this.mainConcernService.getConcernByName(allUserResponse[0].get('concern'));
    const concern = concernObj.get('value');
    allUserResponse.forEach((response: Parse.Object) => evaluatedResponse.push(response.get('evaluatedAnswer')));
    const evaluatedResponseString = evaluatedResponse.join('_');
    const key = [concern, evaluatedResponseString].join('_');
    return regimenMap[key] as string;
  }
}
