import { Result } from './result.schema';
import { IResultModel, IResult } from './result.interface';
import Question, { checkedAnswer } from '../question/question.model';
import { ObjectID } from "bson";
import { HTTP400Error } from '../../lib/utils/httpErrors';
import { isValidMongoId } from '../../lib/helpers';
import { Quiz } from '../quiz/quiz.schema';
import { IQuizModel } from '../quiz/quiz.interface';

export class ScoreModel {


    public async create(body: IResult) {
        const p: IResultModel = new Result(body)
        return await p.add()
    }

    async update(body: any, userId: string): Promise<checkedAnswer> {
        console.log("hii");
        if (isValidMongoId(body.resultId.toString()) && isValidMongoId(userId.toString())) {
            let score: checkedAnswer = await Question.pointsScored(body.quesId, body.answer);
            console.log(score);
            let result = await Result.findById(new ObjectID(body.resultId));
            let attempts = await Result.find({ userId: userId, roomId: result.roomId }).count();
            let quiz = await Quiz.findById(result.roomId)
            if (result && attempts != null && attempts != undefined && quiz) {
                let pointsScored = Number(body.score)
                let currScore = result.score | 0;
                if (score.isCorrect) {
                    result.countCorrect += 1;
                    result.score = currScore + pointsScored;
                }
                result.questionsAnswered.push({ quesId: body.quesId, answerMarked: body.answer, isCorrect: score.isCorrect, pointScored: pointsScored })
                await result.save();
                score.points = pointsScored
                score.total = result.score;
                return score;
            } else {
                throw new HTTP400Error('No such Score ID')
            }
        } else {
            throw new HTTP400Error('No such MongoDB ID')
        }
    }

    async timedOut(body: any) {
        if (isValidMongoId(body.quesId.toString())) {
            let result = await Result.findById(new ObjectID(body.resultId));
            result!.questionsAnswered.push({ quesId: body.quesId, answerMarked: 'TIMED OUT', isCorrect: false, pointScored: 0 })
            await result!.save();
            let question = await Question.fetchAnswer(body.quesId)
            return { quesId: question._id, answer: question.answer }
        } else {
            throw new HTTP400Error('Not valid MongoDB ID')
        }
    }


    async end(body: any) {
        try {
            if (isValidMongoId(body.resultId.toString())) {
                let result = await Result.findById(body.resultId);
                if (result) {
                    let quiz: IQuizModel | null = await Quiz.findById(result.roomId);
                    let accuracyData :any = await Result.aggregate([{
                        $match: {
                            $and: [{ roomId: result.roomId }, { userId: result.userId }]
                        },
                    }, {
                        $group: {
                            _id: '$roomId',
                            totalCorrect: { $sum: '$countCorrect' },
                            totalAttempted : { $sum: {$size:'$questionsAnswered'} }
                        }
                    }])
                    if (quiz) {
                        result.accuracy = Math.ceil((accuracyData[0].totalCorrect / accuracyData[0].totalAttempted)*100);
                        await result.save();
                        return { score: result.score, countCorrect: result.countCorrect,maxQuestions: quiz.metadata.maxQuestions}
                    } else {
                        throw new HTTP400Error('Not valid MongoDB Quiz ID')
                    }
                } else {
                    throw new HTTP400Error('Not valid MongoDB ID')
                }
            } else {
                throw new HTTP400Error('Not valid MongoDB ID')
            }
        } catch (e) {
            throw new HTTP400Error(e)
        }
    };

    public async guestResult(body:any) {
        if (isValidMongoId(body.resultId.toString()) ) {
            let score: checkedAnswer = await Question.pointsScored(body.quesId, body.answer);
            console.log(score);
            let result = await Result.findById(new ObjectID(body.resultId));
            let attempts = await Result.find({ roomId: result.roomId }).count();
            let quiz = await Quiz.findById(result.roomId)
            if (result && attempts != null && attempts != undefined && quiz) {
                let pointsScored = Number(body.score)
                let currScore = result.score | 0;
                if (score.isCorrect) {
                    result.countCorrect += 1;
                    result.score = currScore + pointsScored;
                }
                result.questionsAnswered.push({ quesId: body.quesId, answerMarked: body.answer, isCorrect: score.isCorrect, pointScored: pointsScored })
                await result.save();
                score.points = pointsScored
                score.total = result.score;
                return score;
            } else {
                throw new HTTP400Error('No such Score ID')
            }
        } else {
            throw new HTTP400Error('No such MongoDB ID')
        }
    };


    
    async guestEnd(body: any) {
        try {
            if (isValidMongoId(body.resultId.toString())) {
                let result = await Result.findById(body.resultId);
                if (result) {
                    let quiz: IQuizModel | null = await Quiz.findById(result.roomId);
                    let accuracyData :any = await Result.aggregate([{
                        $match: {
                            $or: [{ roomId: result.roomId }, { userId: result.userId }]
                        },
                    }, {
                        $group: {
                            _id: '$roomId',
                            totalCorrect: { $sum: '$countCorrect' },
                            totalAttempted : { $sum: {$size:'$questionsAnswered'} }
                        }
                    }])
                    if (quiz) {
                        result.accuracy = Math.ceil((accuracyData[0].totalCorrect / accuracyData[0].totalAttempted)*100);
                        await result.save();
                        return { score: result.score, countCorrect: result.countCorrect,maxQuestions: quiz.metadata.maxQuestions}
                    } else {
                        throw new HTTP400Error('Not valid MongoDB Quiz ID')
                    }
                } else {
                    throw new HTTP400Error('Not valid MongoDB ID')
                }
            } else {
                throw new HTTP400Error('Not valid MongoDB ID')
            }
        } catch (e) {
            throw new HTTP400Error(e)
        }
    };

}

export default new ScoreModel()