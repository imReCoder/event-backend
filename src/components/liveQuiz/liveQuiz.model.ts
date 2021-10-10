import { Quiz } from "./../quiz/quiz.schema";
import mongoose from 'mongoose';
import { IQuiz, IQuizModel } from "./../quiz/quiz.interface";
import { isValidMongoId, pruneFields } from "../../lib/helpers";
import { HTTP400Error } from "../../lib/utils/httpErrors";
import { mongoDBProjectFields } from "../../lib/utils";
import Question from '../question/question.model'
import { LiveQuiz } from "./liveQuiz.schema";
import { ILiveQuiz, ILiveQuizModel } from "./liveQuiz.interface";
import quizModel from "../quiz/quiz.model";
import liveQuizLeaderboardModel from "../liveQuizLeaderboard/liveQuizLeaderboard.model";

export class LiveQuizModel {

    // private questionFields: string = "_id content level categoryId options points";
    public async add(quizId:any) {
        try {
            const quiz = await Quiz.findById(quizId);
            // just for testing
            if (quiz.startDate < Date.now()) {
                const body: ILiveQuiz = {
                        roomId: quizId,
                        users: [],
                    }
                const liveQuizBody: ILiveQuizModel = new LiveQuiz(body);
                await liveQuizBody.add();
            } else
            {
                return { proceed: false };
            }
            
            return { proceed: true };
        }catch(e){
            console.log(e);
            throw new HTTP400Error(e);
        }
    }
    
    public async joinRoom(socketId:string,userId:string,quizId: string) {
        const quiz = await this.isQuizExist(quizId);

        if (!quiz.alreadyExist) {
            const quiz = await this.add(quizId);

            if (quiz.proceed) {
                await LiveQuiz.findOneAndUpdate({ roomId: quizId }, {
                    $push: { "users": { userId: userId, socketId: socketId } }
                },
                    {
                        new: true
                    }
                );
            }
        } else {
            const isUser = await this.isUserExist(userId, quizId);
            console.log("IsUser = " + isUser.alreadyExist);
            if (isUser.alreadyExist) {
                await LiveQuiz.findOneAndUpdate({ $and: [{ roomId: quizId }, { users: { $elemMatch: { userId: userId } } }] }, {
                    $set: { "users.$.socketId": socketId }
                },
                    {
                        new: true
                    }
                );
            } else
            {
                await LiveQuiz.findOneAndUpdate({ roomId: quizId }, {
                    $push: { "users": { userId: userId, socketId: socketId } }
                },
                    {
                        new: true
                    }
                );
            };
        }

        return { proceed: true, roomId: quizId };
    };

    public async isUserExist(userId: string,roomId:string) {
        const quiz = await LiveQuiz.findOne({ $and: [{ roomId: roomId }, { users: { $elemMatch: { userId: userId } } }] });
        console.log("Isquiz = " + quiz);
        if (quiz == null) {
            return { alreadyExist: false };
        }

        return { alreadyExist: true };
    }

    public async getQuestions(body: any, socketId: string) {
        console.log(body.userId);
        const livequiz = await LiveQuiz.findOne({ users: { $elemMatch: { userId: body,socketId:socketId } } });
        console.log(livequiz);
        const question = await quizModel.fetchOneRandomQuestions(livequiz.roomId);
        console.log(question);
        return question;
    };

    public async isQuizExist(roomId:string) {
        const liveQuiz = await LiveQuiz.find({ roomId });

        if (liveQuiz == null) {
            return { alreadyExist: false };
        }

        return { alreadyExist: true };
    }

    public async resultCalc(questionId:string,answer: string, userId: string, roomId: string) {

        const result = await Question.pointsScored(questionId, answer);

        if (result) {
            const resultBody = {
                roomId,
                userId,
                score: result.points
            };

            const leaderboard = await liveQuizLeaderboardModel.updateleaderboard(resultBody);
        }
    };
}
export default new LiveQuizModel();