import { Result } from './result.schema';
import { IResultModel, IResult } from './result.interface';
import Question, { checkedAnswer } from '../question/question.model';
import { ObjectID } from "bson";
import { HTTP400Error } from '../../lib/utils/httpErrors';
import { isValidMongoId } from '../../lib/helpers';
import { Quiz } from '../quiz/quiz.schema';
import { IQuizModel } from '../quiz/quiz.interface';

export class ScoreModel {

    public unlockLevelCalculator(scoreTillNow: number): number {
        console.log('ScoreTillNow :',scoreTillNow);
        return (scoreTillNow % 500) != 0 ? Math.ceil((scoreTillNow / 500)) : Math.ceil((scoreTillNow / 500)) + 1;
    }

    public async create(body: IResult) {
        const p: IResultModel = new Result(body)
        return await p.add()
    }

    public getNext500Multiple(score: number): number {
        for (let i = 0; i <= 5000; i += 500) {
            if (i > score) {
                return i;
            }
        }
        return -1;
    }

    private scoreCalculatorBasedOnAttempts(numQuestions: number, attempt: number, scoreTillNow: number, isCorrect: boolean): number {
        if (!isCorrect) {
            return 0;
        } else {
            if (attempt == 1) {
                return Math.ceil(500 / Math.ceil(0.9 * numQuestions))
            } else {
                let n = Math.ceil(0.25 * numQuestions);
                let nearestMultiple = this.getNext500Multiple(scoreTillNow);
                let pointsPerQuestion = Math.min(Math.ceil((nearestMultiple - scoreTillNow) / n), Math.ceil(Math.ceil(500 / Math.ceil(0.9 * numQuestions))));
                return pointsPerQuestion;
            }
        }
    }

    async update(body: any, userId: string): Promise<checkedAnswer> {
        if (isValidMongoId(body.resultId.toString()) && isValidMongoId(userId.toString())) {
            let score: checkedAnswer = await Question.pointsScored(body.quesId, body.answer);
            let result = await Result.findById(new ObjectID(body.resultId));
            let attempts = await Result.find({ userId: userId, quizId: result!.quizId }).count();
            let quiz = await Quiz.findById(result!.quizId)
            let scoreTillNow = 100//await Wallet.getCategoryScore(userId, quiz!.categoryId);
            if (result && attempts != null && attempts != undefined && quiz) {
                let pointsScored = this.scoreCalculatorBasedOnAttempts(quiz!.metadata.maxQuestions, attempts, scoreTillNow, score.isCorrect)
                let currScore = result.score | 0;
                result.score = currScore + pointsScored;
                if (score.isCorrect) {
                    result.countCorrect += 1;
                }
                result.questionsAnswered.push({ quesId: body.quesId, answerMarked: body.answer, isCorrect: score.isCorrect, pointScored: pointsScored })
                await result.save();
                if (quiz.level == result.maxLevelUnlockedAtStart) {
                    // await Wallet.addScoreToCategory(userId, quiz!.categoryId, pointsScored);
                }
                score.points = pointsScored
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
                    let attempts = await Result.find({ userId: result.userId, quizId: result.quizId }).count();
                    let quiz: IQuizModel | null = await Quiz.findById(result.quizId)
                    let scoreTillNow =100 //await Wallet.getCategoryScore(result.userId, quiz!.categoryId);
                    let maxLevelUnolocked = this.unlockLevelCalculator(scoreTillNow);
                    let accuracyData :any = await Result.aggregate([{
                        $match: {
                            $and: [{ quizId: result.quizId }, { userId: result.userId }]
                        },
                    }, {
                        $group: {
                            _id: '$quizId',
                            totalCorrect: { $sum: '$countCorrect' },
                            totalAttempted : { $sum: {$size:'$questionsAnswered'} }
                        }
                    }])
                    if (quiz) {
                        result.maxLevelUnlockedAtEnd = maxLevelUnolocked;
                        result.accuracy = Math.ceil((accuracyData[0].totalCorrect / accuracyData[0].totalAttempted)*100);
                        await result.save();
                        return { score: result.score, countCorrect: result.countCorrect, maxLevelUnolocked: maxLevelUnolocked, maxQuestions: quiz.metadata.maxQuestions, attempts: attempts, totalScore: scoreTillNow, outOf: (result.maxLevelUnlockedAtStart * 500), accuracy: result.accuracy }
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
    }

}

export default new ScoreModel()