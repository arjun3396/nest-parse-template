import { CollectionUtil } from './query.util';
import { DB } from './db.util';
import { Injectable } from '@nestjs/common';
import { TypeNode, TypeTree } from '../../types/type-tree';

@Injectable()
class Tree {
  constructor(private db: DB) {}

  async initialize(): Promise<any> {
    const versions = ['v1'];
    await this.db.connect();
    await this.db.waitForConnectionToEstablish();
    const versionTrees = await Promise.all(versions.map((version: string) => this.createTree(version)));
    const tree = {};
    const question = {};
    versionTrees.forEach(([nodes, questionMap]: any) => {
      Object.assign(tree, nodes);
      Object.assign(question, questionMap);
    });
    return [tree, question];
  }

  async findQuestions(questionIds: Array<string>): Promise<{ [key: string]: any }> {
    const questions = await this.db.find(CollectionUtil.Question, { _id: { $in: questionIds } });
    const questionMap = {};
    questions.forEach((question_: Parse.Object) => {
      const question: { [key: string]: any } = question_;

      delete question._wperm;
      delete question._acl;
      delete question._rperm;
      delete question._created_at;
      delete question._updated_at;

      questionMap[question._id] = question;
      questionMap[question.uniqueIdentifier] = question;
    });
    return questionMap;
  }

  async createPrimaryTree({ version }: { version: string }): Promise<any> {
    const treeObj: { [key: string]: any } = await this.db.findOne(CollectionUtil.Tree, {
      name: version,
      type: 'BASIC_INFO',
    });
    if (!treeObj) { return [{}, {}]; }
    const treeClass: string = treeObj.class as string;
    const questionIds: Array<string> = treeObj.questions.map((x: { [key: string]: any }) => x.objectId as string) as Array<string>;
    const questionMap: { [key: string]: any } = await this.findQuestions(questionIds);
    const tree: TypeTree = {};
    let previousNode: TypeNode;
    treeObj.questions.forEach((questionPointer: any) => {
      const question = questionMap[questionPointer.objectId];
      const nodeName = previousNode
        ? `${previousNode.nodeName}^${previousNode.fieldName}|_default`
        : `${version}:`;
      tree[nodeName] = {
        nodeName,
        class: treeClass,
        fieldName: question.uniqueIdentifier,
        questionId: question._id,
        table: question.table,
        redirect: {},
      };
      if (previousNode) { previousNode.redirect._default = nodeName; }

      previousNode = tree[nodeName];
    });
    if (previousNode) { previousNode.redirect = {}; }
    return [tree, questionMap];
  }

  createTree(version: string): Promise<any> {
    return Promise
      .all([
        this.createPrimaryTree({ version }),
      ])
      .then((treeQuestionPairs: any) => {
        const finalTree: TypeTree = {};
        const finalQuestions = {};
        treeQuestionPairs.forEach(([tree, questions]: [TypeTree, any]) => {
          Object.assign(finalTree, tree);
          Object.assign(finalQuestions, questions);
        });
        return Promise.resolve([finalTree, finalQuestions]);
      });
  }
}

export { Tree };
