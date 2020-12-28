import { Types } from "mongoose";
import { Award, IAwardModel } from "./award.schema";
import { AwardAnswer, IAwardAnswerModel } from "./award_answer.schema";
import { IAward, IAwardAnswer } from "./award.interface";
import { isValidMongoId, pruneFields } from "../../lib/helpers";
import { User } from "../user/user.schema";
import { IUser } from "../user/user.interface";
import { AwardResult, IAwardResultModel } from "./award_result.schema";
import { HTTP400Error } from "../../lib/utils/httpErrors";
import { paginationConfig } from "../../config";
import { ObjectID } from "bson";
import { mongoDBProjectFields } from "../../lib/utils";

export class SpecializationModel {
  protected ObjectId: Types.ObjectIdConstructor = Types.ObjectId;

  private default = 'nominations language_hindi language_english heading expiredHeading expiredHeading_hindi heading_hindi createdAt image image_hindi credit credit_hindi categories extraData likesCount category subcategory';
  private fieldsOfUser = "firstName lastName avatar userName role";
  private pruningFields: string = '_id user age_filter_min age_filter_max gender_filter region_filter createdAt updatedAt __v';

  async create(body: IAward): Promise<IAwardModel> {
    try {
      console.log(body);
      const q: IAwardModel = new Award(body);
      const data = await q.add();
      const pData = await data.populate('user', this.fieldsOfUser).execPopulate();
      return pData;
    } catch (e) {
      throw new HTTP400Error(e);
    }
  }

  async fetchAwardWithCondition(condition: any, user: string, limit?: number, sortArgument?: string) {
    return Award.aggregate([
      {
        $match: condition
      }, {
        $sort: { [sortArgument || 'createdAt']: -1 }
      }, {
        $limit: limit || paginationConfig.MAX_AWARDS
      }, {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user"
        }
      }, {
        $unwind: { path: '$user' }
      },
      {
        $lookup:
        {
          from: "awardanswers",
          let: {
            award_id: "$_id",
            user_id: new ObjectID(user)
          },
          pipeline: [{
            $match: {
              $expr:
              {
                $and: [
                  { $eq: ["$award", "$$award_id"] },
                  { $eq: ["$user", "$$user_id"] },
                ]
              }
            }
          }],
          as: "userVote"
        }
      },
      {
        $unwind: { path: '$userVote', preserveNullAndEmptyArrays: true }
      },
      {
        $project: {
          ...mongoDBProjectFields(this.fieldsOfUser, 'user'),
          ...mongoDBProjectFields('answer', 'userVote'),
          ...mongoDBProjectFields(this.default),
        }
      }
    ]);
  }

  async fetchAll(query: any, user: string) {
    const today = new Date();
    const age = parseInt(query.age, 10);
    let data;

    const condition: any = {};
    if (query.categories) {
      condition.categories = {
        $in: query.categories.split(',').map((item: string) => item.trim())
      };
    }
    if (query.language === 'hindi') {
      condition.language_hindi = true;
    } else if (query.language === 'english') {
      condition.language_english = true;
    }
    if (query.lastTime) {
      const dateObj = new Date(parseInt(query.lastTime, 10));
      condition.createdAt = { $lt: dateObj };
    }

    let pipeLineCondition;
    let sortArgument;
    if (query.mode === 'expired') {
      sortArgument = 'lifeSpan';
      condition.lifeSpan = { $lte: today };
      condition.hidden = false;
      pipeLineCondition = condition;
    } else {
      sortArgument = 'createdAt';
      condition.lifeSpan = { $gte: today };
      condition.hidden = false;
      pipeLineCondition = condition
    }
    console.log(user);
    data = await this.fetchAwardWithCondition(pipeLineCondition, user, paginationConfig.MAX_AWARDS, sortArgument);
    const lastTime = (data.length > 0) ? data[data.length - 1].createdAt.getTime() : undefined;
    return {
      payload: data,
      lastTime,
      maxCount: paginationConfig.MAX_AWARDS
    };
  }

  async update(id: string, body: IAward) {
    if (isValidMongoId(id)) {
      pruneFields(body, this.pruningFields);
      const data = await Award.findByIdAndUpdate(id, body, { new: true, runValidators: true });
      if (data) {
        return data;
      }
      throw new HTTP400Error("Document Not Found");
    } else {
      throw new HTTP400Error("Not Valid MongoDB ID");
    }
  }


  async addAnswer(awardAnswer: IAwardAnswer): Promise<IAwardAnswer | { alreadyAnswered: Boolean }> {
    try {
      if (isValidMongoId(awardAnswer.award)) {
        let alreadyAnswered = await AwardAnswer.findOne({ $and: [{ user: awardAnswer.user }, { award: awardAnswer.award }] }).lean();
        if (!alreadyAnswered) {
          const userId = awardAnswer.user;
          const userData: IUser = await User.findById(userId).lean();
          const q: IAwardAnswerModel = new AwardAnswer(awardAnswer);
          await Award.findByIdAndUpdate(awardAnswer.award, { $inc: { 'voteCount': 1 } });
          return q.add();
        } else {
          return { alreadyAnswered: true }
        }
      } else {
        throw new HTTP400Error('Invalid Award Id')
      }
    } catch (e) {
      throw new HTTP400Error(e);
    }
  }

  async buildResultTemplate(awardData: IAwardModel) {
    const startingPoint: any = {
      global: {},
    };
    const nominations: any = {};
    const nominationsNames: any = {};
    const nominationsImages: any = {};
    awardData.nominations.forEach(option => {
      nominations[option.key] = { 'audience': 0, 'jury': 0, 'net': 0 };
      nominationsNames[option.key] = option.name;
      nominationsImages[option.key] = option.image;
    });
    // console.log(nominations);
    startingPoint.votes = { ...nominations };
    startingPoint.options = nominationsNames;
    startingPoint.images = nominationsImages;
    return startingPoint;
  }


  async fetchAwardsBycategory(body: any) {
    try {
      if (isValidMongoId(body.categoryId)) {
        let data = await Award.find({ categoryId: body.categoryId }).select(this.default);
        return data;
      } else {
        throw new HTTP400Error('Not a Valid MongoDB ID')
      }
    } catch (e) {
      throw new HTTP400Error(e);
    }
  }

  async fetchCommentsAudience(award: string) {
    try {
      if (isValidMongoId(award.toString())) {
        return await AwardAnswer.aggregate([
          {
            $match: { award: new ObjectID(award) }
          },
          {
            $lookup: {
              from: "users",
              localField: "user",
              foreignField: "_id",
              as: "user"
            }
          },
          {
            $unwind: { path: '$user' }
          },
          {
            $lookup: {
              from: "awards",
              localField: "award",
              foreignField: "_id",
              as: "award"
            }
          },
          {
            $unwind: { path: '$award' }
          },
          {
            $unwind: { path: '$award.nominations' }
          },
          {
            $match: { $expr: { $eq: ['$answer', '$award.nominations.key'] } }
          },
          {
            $project: {
              ...mongoDBProjectFields(this.fieldsOfUser, 'user'),
              ...mongoDBProjectFields('createdAt'),
              'award.nominations': 1,
              '_id': 0
            }
          }
        ])
      } else {
        throw new HTTP400Error('Not a Valid Mongo ID')
      }
    } catch (e) {
      throw new HTTP400Error(e)
    }
  }

  async fetchCommentsJury(award: string) {
    try {
      if (isValidMongoId(award.toString())) {
        return await Award.findById(award).select('jurys.name jurys.comments jurys.image -_id jurys.organization jurys.designation');
      } else {
        throw new HTTP400Error('Not a Valid Mongo ID')
      }
    } catch (e) {
      throw new HTTP400Error(e)
    }
  }

  async fetchNominees(award: string) {
    try {
      if (isValidMongoId(award.toString())) {
        return await Award.findById(award).select('nominations');
      } else {
        throw new HTTP400Error('Not a Valid Mongo ID')
      }
    } catch (e) {
      throw new HTTP400Error(e)
    }
  }

  countVotes(awardAnswers: IAwardAnswerModel[], startingPoint: any, juryWeighatge: number, audienceWeightage: number, jury: any[]) {
    let totalVotes: any = { "audience": 0, "jury": 0, "net": 0 };
    let finalResult: any = { 'nominees': {} };
    awardAnswers.forEach(answer => {
      const answerKey = answer.answer;
      startingPoint.votes[answerKey]['audience'] += 1;
      totalVotes['audience'] += 1;
      totalVotes['net'] += 1;
    });
    jury.forEach(judge => {
      const answerKey = judge.answer;
      if (answerKey != undefined && answerKey != null) {
        startingPoint.votes[answerKey]['jury'] += 1;
        totalVotes['jury'] += 1;
        totalVotes['net'] += 1;
      }
    })
    let votes: any = { ...startingPoint.votes }
    let names: any = { ...startingPoint.options }
    let winner: any = {}
    let maxPercentTillNow = - 1;
    for (let vote in votes) {
      let obj: any = {}
      obj[names[vote]] = { "id": vote, "audience": 0, "jury": 0, "overall": { "percentage": 0, "value": 0 } }
      let audiencesVote = votes[vote]['audience']
      let juryVote = votes[vote]['jury']
      obj[names[vote]]['audience'] = Math.ceil((audiencesVote / totalVotes['audience']) * 100) ? Math.ceil((audiencesVote / totalVotes['audience']) * 100) : 0,
        obj[names[vote]]['jury'] = Math.ceil((juryVote / totalVotes['jury']) * 100) ? Math.ceil((juryVote / totalVotes['jury']) * 100) : 0
      obj[names[vote]]['overall']['percentage'] = Math.ceil(obj[names[vote]]['audience'] * (audienceWeightage / 100)) + Math.ceil(obj[names[vote]]['jury'] * (juryWeighatge / 100));
      obj[names[vote]]['overall']['value'] = votes[vote]['audience'] + votes[vote]['jury']
      if (obj[names[vote]]['overall']['percentage'] > maxPercentTillNow) {
        winner = { id: vote, name: names[vote], image: startingPoint.images[vote] };
        maxPercentTillNow = obj[names[vote]]['overall']['percentage']
      }
      finalResult['nominees'][names[vote]] = obj[names[vote]];
    }
    finalResult['totalVotes'] = totalVotes.net
    finalResult['winner'] = { ...winner }
    return finalResult;
  }



  async getAwardResults(awardId: string) {

    const data = await AwardResult.findOne({
      award: awardId
    }).populate('award', '_id heading heading_hindi expiredHeading expiredHeading_hindi nominations jurys brandName brandName_hindi image awardvideo language_hindi language_english');

    console.log('async section complete ' + data);
    let update = false;
    if (data) {
      console.log('data was found already existing');
      let timeDelta = new Date().getTime() - data.last_count;
      timeDelta = timeDelta / 1000;
      console.log(timeDelta);
      if (timeDelta < 300) {
        console.log("Returning Cached Results");
        return data;
      }
      // else count votes
      console.log("Re-Calc Award Poll Results");
      update = true;
    }
    const timeNow = new Date().getTime();
    const awardAnswers = await AwardAnswer.find({
      award: awardId
    });

    const awardData = await Award.findById(awardId) as IAwardModel;
    const startingPoint = await this.buildResultTemplate(awardData);
    const votes = this.countVotes(awardAnswers, startingPoint, awardData.juryWeightage, awardData.audienceWeightage, awardData.jurys);
    votes.last_count = timeNow;
    votes.award = awardId;

    let newVotes;
    if (update) {
      const resultId = (data as IAwardResultModel)._id as string;
      newVotes = await AwardResult.findOneAndUpdate({ _id: resultId }, votes, { new: true }) as IAwardResultModel;
    } else {
      console.log("Adding Document");
      const newResult = new AwardResult(votes);
      newVotes = await newResult.add();
    }
    newVotes = newVotes.toJSON();
    return {
      ...newVotes,
      award: {
        _id: awardData._id,
        heading: awardData.heading,
        heading_hindi: awardData.heading_hindi,
        expiredHeading: awardData.expiredHeading,
        expiredHeading_hindi: awardData.expiredHeading_hindi,
        nominations: awardData.nominations,
        jurys: awardData.jurys,
        image: awardData.image,
        awardvideo: awardData.awardvideo,
        language_english: awardData.language_english,
        language_hindi: awardData.language_hindi,
        audienceWeightage: awardData.audienceWeightage,
        juryWeighatge: awardData.juryWeightage
      }
    };

  }
}

export default new SpecializationModel();
