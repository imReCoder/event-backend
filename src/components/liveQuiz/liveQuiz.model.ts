import { Quiz } from "./../quiz/quiz.schema";
import mongoose from 'mongoose';
import { Request as req } from "express";
import { IQuiz, IQuizModel } from "./../quiz/quiz.interface";
import  LeaderBoard  from "../leaderboard/leaderboard.model";
import { isValidMongoId, pruneFields } from "../../lib/helpers";
import { HTTP400Error } from "../../lib/utils/httpErrors";
import { ObjectID } from "bson";
import { mongoDBProjectFields } from "../../lib/utils";
import Result from '../result/result.model'
import Wallet from '../IKCPool/ikcPool.model'
import _, { forEach, isObject } from 'lodash'
import Question from '../question/question.model'
import { ikcPool } from '../IKCPool/ikcPool.schema'
import { PoolStatus } from "../IKCPool/ikcPool.interface";
import { MetadataService } from "aws-sdk";
import { ITransaction, ITransactionModel } from "../transactions/transaction.interface";
import { Transaction} from "../transactions/transaction.schema";
import axios from 'axios';
import transactionModel from "../transactions/transaction.model";
import { LiveQuiz } from "./liveQuiz.schema";
import { ILiveQuiz, ILiveQuizModel } from "./liveQuiz.interface";
import quizModel from "../quiz/quiz.model";
import resultModel from "../result/result.model";

export class LiveQuizModel {

    private questionFields: string = "content level categoryId options points";
    public async add(socketId:any,userId:any,quizId:any) {
        try {
            const quiz = await Quiz.findById(quizId);
            // just for testing
            if (quiz.startDate < Date.now()) {
                userId = mongoose.Types.ObjectId(userId);
                const liveQuiz = await LiveQuiz.findOne({ roomId: quizId });
                if (liveQuiz == null) {
                    const body: ILiveQuiz = {
                        roomId: quizId,
                        users: [{ userId, socketId }],
                    }
                    const liveQuizBody: ILiveQuizModel = new LiveQuiz(body);
                    await liveQuizBody.add();
                }
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
    
    public async joinRoom(socketId:any,userId:any,quizId: any) {
        const result = await this.add(socketId,userId,quizId);

        if (result.proceed) {
            return { proceed: true,roomId:quizId };
        } else
        {
          return { proceed: false };
        }
    };

    public async getQuestions(body: any, socketId: string) {
        console.log(body.userId);
        const livequiz = await LiveQuiz.findOne({ users: { $elemMatch: { userId: body,socketId:socketId } } });
        console.log(livequiz);
        const question = await quizModel.fetchOneRandomQuestions(livequiz.roomId);
        console.log(question);
        return question;
    };

    public async resultCalc(resultId:any,answer:any,userId: any, roomId: any) {
        const body = {
            resultId: resultId,
            roomId: roomId,
            answer: answer,
        };

        const result = await resultModel.update(body, userId);

        return result.isCorrect;
    };
}
export default new LiveQuizModel();