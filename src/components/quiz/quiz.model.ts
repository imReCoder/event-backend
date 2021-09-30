import { Quiz } from "./quiz.schema";
import { IQuiz, IQuizModel } from "./quiz.interface";
import { isValidMongoId, pruneFields } from "../../lib/helpers";
import { HTTP400Error } from "../../lib/utils/httpErrors";
import { ObjectID } from "bson";
import { mongoDBProjectFields } from "../../lib/utils";
import Result from '../result/result.model'
import Wallet from '../IKCPool/ikcPool.model'
import _ from 'lodash'
import Question from '../question/question.model'
import { ikcPool } from '../IKCPool/ikcPool.schema'
import { PoolStatus } from "../IKCPool/ikcPool.interface";



export class QuizModel {
  private default: string = "title maxScore timeAlloted level category icon metadata visibility poolamount startDate endDate isFreebie";
  private fieldsOfUser = "firstName lastName avatar userName createdAt email _id";
  private pruningFields: string = '_id creator createdAt updatedAt __v';
  private questionFields: string = "content level categoryId options points";
  public rulePdf: string = 'https://drive.google.com/uc?export=view&id=1864Oc6WPcYQLq7wXyw4ZWIcN885_NVhU'

  async create(body: any, userId: string): Promise<IQuizModel> {
    try {
      const temp = { ...body }
      temp.creator = userId;
      temp.questions = body.questions;
      temp.metadata = body.metadata;
      const q: IQuizModel = new Quiz(temp);
      const data = await q.add();
      return data.populate('creator', this.fieldsOfUser).execPopulate();
    } catch (e) {
      console.log(e)
      throw new HTTP400Error(e);
    }
  }

  async registerForQuiz(userId: string, roomId: string) {
    try {
      if (isValidMongoId(userId.toString()) && isValidMongoId(roomId.toString())) {
        let exist = await ikcPool.findOne({ $and: [{ userId: userId }, { roomId: roomId }] });
        if (!exist) {
          let quiz = await Quiz.findById(roomId);
          let body = {
            userId: userId,
            cost: quiz.poolAmount,
            roomId: roomId,
            status: PoolStatus.PENDING
          }
          let pool = new ikcPool(body);
          await Quiz.findByIdAndUpdate(roomId, { $inc: { totalRegisterations: 1 } });
          await this.deductIKC(userId,quiz.poolAmount);
          return await pool.save();
        } else {
          return { alreadyRegistered: true }
        }
      } else {
        throw new HTTP400Error('Not a valid mongoDB Id')
      }
    } catch (e) {
      throw new HTTP400Error(e);
    }
  }

  async fetchQuizByCondition(condition: any) {
    return Quiz.aggregate([
      {
        $match: condition
      },
      {
        $sort: { 'createdAt': -1 }
      }, {
        $lookup: {
          from: "users",
          localField: "creator",
          foreignField: "_id",
          as: "user"
        }
      }, {
        $unwind: { path: '$user' }
      },
      {
        $project: {
          ...mongoDBProjectFields(this.fieldsOfUser, 'user'),
          ...mongoDBProjectFields(this.default),
        }
      }
    ]);
  }

  async fetchQuiz(query: any) {
    const condition: any = {};
    if (query.level) {
      condition.level = Number(query.level);
    }
    if (query.categoryId) {
      condition.categoryId = new ObjectID(query.categoryId);
    }
    if (query.creator) {
      condition.cretaor = query.creator
    }
    let data = await this.fetchQuizByCondition(condition)
    return {
      payload: data
    };
  }

  async fetchByActiveQuiz(body: any) {
    let today = new Date();
    let condition
    if (body.type == 'classic') {
      condition = {
        $and: [{ startDate: { $gte: today } }, { isFreebie: false }]
      }
    } else {
      condition = { isFreebie: true }
    }
    let quizzes = await this.fetchQuizByCondition(condition);
    return { quizzes: quizzes }
  }

  private async verifyCode(quizId: string, code: string): Promise<{ proceed: boolean }> {
    let quiz: IQuizModel = await Quiz.findById(quizId);
    if (quiz) {
      if ((quiz.visibility == 'private' && quiz.code == code) || (quiz.visibility == 'public')) {
        return { proceed: true }
      } else {
        return { proceed: false }
      }
    } else {
      throw new HTTP400Error('Invalid Quiz Id')
    }
  }

  async fetchById(id: string, user: string) {

    if (!isValidMongoId(id)) {
      throw new Error("Not Valid MongoDB ID");
    }
    const data = await this.fetchQuizByCondition({ _id: new ObjectID(id) });
    if (data && data.length === 1) {
      return {
        payload: data
      };
    }
    throw new HTTP400Error("Document Not Found");
  }

  async delete(id: string) {
    if (isValidMongoId(id)) {
      console.log(id);
      const data = await Quiz.findByIdAndDelete(id);
      if (data) {
        return data;
      }
      throw new HTTP400Error("Document Not Found");
    } else {
      throw new HTTP400Error("Not Valid MongoDB ID");
    }
  }

  async update(id: string, body: IQuiz) {
    if (isValidMongoId(id)) {
      pruneFields(body, this.pruningFields);
      console.log(body);
      const data = await Quiz.findByIdAndUpdate(id, body, { new: true, runValidators: true });
      if (data) {
        return data;
      }
      throw new HTTP400Error("Document Not Found");
    } else {
      throw new HTTP400Error("Not Valid MongoDB ID");
    }
  }

  // Under Development || current error: $sample requires number (Optimized Query for future use)

  async fetchRandomQuestions(quizId: string) {
    return await Quiz.aggregate([
      {
        $match: { _id: new ObjectID(quizId) }
      },
      {
        $unwind: { path: '$questions' }
      },
      {
        $lookup: {
          from: 'questions',
          let: {
            categoryId: '$questions.category',
            level: '$questions.level',
            questionCount: 5
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$categoryId", "$$categoryId"] },
                    { $eq: ["$level", "$$level"] }
                  ]
                }
              }
            },
            {
              $sample: { size: "$$questionCount" }
            },
            {
              $sort: { points: 1 }
            }
          ],
          as: 'question'
        }
      },
      {
        $unwind: { path: '$question' }
      },
      {
        $project: {
          ...mongoDBProjectFields(this.questionFields, 'question'),
          _id: 0
        }
      }
    ])
  }

  // End of optimized query

  async start(userId: string, quizId: string, code?: string) {
    if (isValidMongoId(userId.toString()) && isValidMongoId(quizId.toString())) {
      let codeVerification = await this.verifyCode(quizId, code)
      let quiz = await Quiz.findById(quizId);
      if (quiz && codeVerification.proceed) {
        let questionsArray: any[] = []
        for (let condition of quiz.questions) {
          let data = await Question.fetchRandomQuestions(condition);
          questionsArray = _.concat(questionsArray, _.cloneDeep(data))
        }
        let newScore: any = {
          userId: userId,
          roomId: quizId,
          score: 0,
          questionsAnswered: [],
          countCorrect: 0
        }
        let result = await Result.create(newScore);
        questionsArray = _.shuffle(questionsArray)
        return { resultId: result._id, questions: questionsArray };
      } else {
        throw new HTTP400Error("Not a valid Quiz ID");
      }
    } else {
      throw new HTTP400Error("Not a valid mongoDB ID");
    }
  }

  private async deductIKC(userId:string , cost:number){
    try{
      await Wallet.deductIKC(userId,cost)
    }catch(e){
      throw new HTTP400Error(e);
    }
  }
  public async fetchUsersToNotify(condition: any) {
    try {
      await Quiz.updateMany({ $expr: { $gte: ['totalRegisterations', 'metadata.minPlayers'] } }, { $set: { status: 'active' } });
      return Quiz.aggregate([
        {
          $match: condition
        },
        {
          $lookup: {
            from: 'ikcpools',
            let: {
              roomId: '$_id',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ['$roomId', '$$roomId'] }, { $eq: ['$notify', true] }]
                  }
                }
              }
            ],
            as: 'ikcPools'
          }
        },
        {
          $unwind: { path: 'ikcPools' }
        },
        {
          $lookup: {
            from: 'users',
            localField: '$ikcPools.userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $unwind: { path: 'user' }
        },
        {
          $project: {
            ...mongoDBProjectFields('user', this.fieldsOfUser),
            ...mongoDBProjectFields(this.default)
          }
        }
      ])
    } catch (e) {
      throw new HTTP400Error(e);
    }
  }

  public async sendQuizStartNotification(body: any) {
    body
  }
}

export default new QuizModel();
