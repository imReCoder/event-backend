import { Question } from './question.schema'
import { IQuestion, IQuestionModel } from './question.interface'
import { isValidMongoId, pruneFields } from "../../lib/helpers";
import { HTTP400Error } from "../../lib/utils/httpErrors";
import { ObjectID } from "bson";
import { mongoDBProjectFields } from "../../lib/utils";


export type checkedAnswer = {
    isCorrect: boolean,
    points: number,
    optionMarked: string,
    correctOption: string
}

export class QuestionModel {

    private fieldsOfUser: string = "firstName lastName avatar userName";
    private default: string = "content level categoryId options points";
    private defaultWithAnswer : string = "content level categoryId options points answer";
    private pruningFields: string = '_id creator createdAt updatedAt __v';

    async create(body: any, userId: string): Promise<IQuestionModel> {
        try{
            let temp = { ...body }
            temp.creator = userId;
            temp.content = {
                isText: body.isText,
                question: body.question
            }
            if (!body.isText) {
                temp.content.answerImage = body.answerImage
            }
            temp.options = body.options
            const newQues: IQuestionModel = new Question(temp);
            newQues.answer = newQues.options[Number(newQues.answer) - 1]._id
            const data = await newQues.add()
            return data.populate('creator', this.fieldsOfUser).execPopulate();
        }catch(e){
            console.log(e);
            throw new HTTP400Error(e);
        }
    }

    private async fetchQuestionByCondition(condition: any, limit?: number) {
        return Question.aggregate([
            {
                $match: condition
            },
            {
                $sort: { 'createdAt': -1 }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'creator',
                    foreignField: "_id",
                    as: "creator"
                }
            },
            {
                $limit: limit
            },
            {
                $unwind: { path: '$creator' }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: 'categoryId',
                    foreignField: "_id",
                    as: "category"
                }
            },
            {
                $unwind: { path: '$category' }
            },
            {
                $project: {
                    ...mongoDBProjectFields(this.fieldsOfUser, 'creator'),
                    ...mongoDBProjectFields(this.defaultWithAnswer)
                }
            }
        ]).exec()
    }

    private async randomQuestionsPicker(condition: any) {
        let category = condition.category;
        let questionsCount = condition.questionsCount;
        return await Question.aggregate([
            {
                $match: {
                    categoryId: new ObjectID(category)
                }
            },
            {
                $sample: { size: questionsCount }
            },
            {
                $sort: { points: 1 }
            },
            {
                $project: {
                    ...mongoDBProjectFields(this.default)
                }
            }
        ]).exec()
    }

    public async fetchAllQuestions(body: any) {
        let condition: any = {};
        if (body.level) {
            condition.level = Number(body.level);
        }
        if (body.category) {
            condition.categoryId = new ObjectID(body.category);
        }
        if (body.id) {
            condition._id = new ObjectID(body.id)
        }
        if (body.title) {
            condition['content.question'] = { $regex: body.title, $options: 'i' }
        }
        let page: number;
        body.page ? page = body.page : page = 1;
        return await this.fetchQuestionByCondition(condition, page * 50);
    }

    async fetchById(id: string) {
        if (!isValidMongoId(id)) {
            throw new Error("Not Valid MongoDB ID");
        }
        const data = await this.fetchQuestionByCondition({ _id: new ObjectID(id) }, 1);
        if (data && data.length === 1) {
            return {
                payload: data[0]
            };
        }
        throw new HTTP400Error("Document Not Found");
    }

    async delete(id: string) {
        if (isValidMongoId(id)) {
            const data = await Question.findByIdAndDelete(id);
            if (data) {
                return data;
            }
            throw new HTTP400Error("Document Not Found");
        } else {
            throw new HTTP400Error("Not Valid MongoDB ID");
        }
    }

    async update(id: string, body: IQuestion) {
        try {
            if (isValidMongoId(id)) {
                pruneFields(body, this.pruningFields);
                const data = await Question.findByIdAndUpdate(id, body, { new: true, runValidators: true });
                if (data) {
                    return data;
                } else {
                    throw new HTTP400Error("Document Not Found");
                }
            } else {
                throw new HTTP400Error("Not Valid MongoDB ID");
            }
        } catch (e) {
            console.log(e);
            throw new HTTP400Error(e)
        }
    }

    async pointsScored(id: string, answer: string): Promise<checkedAnswer> {
        if (isValidMongoId(id)) {
            const q = await Question.findById(id);
            if (q) { return q.answer == answer ? { isCorrect: true, points: q.points, optionMarked: answer, correctOption: q.answer } : { isCorrect: false, points: 0, optionMarked: answer, correctOption: q.answer } }
            else { throw new HTTP400Error("Invalid Question ID") }
        } else {
            throw new HTTP400Error("Not Valid MongoDB ID")
        }
    }

    async fetchRandomQuestions(condition: any) {
        let data = await this.randomQuestionsPicker(condition);
        return data
    }

    async fetchAnswer(id: string) {
        if (isValidMongoId(id.toString())) {
            return await Question.findById(id).select('answer').lean();
        } else {
            throw new HTTP400Error("Not Valid MongoDB ID")
        }
    }

}

export default new QuestionModel()
