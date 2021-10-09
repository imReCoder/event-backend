import { Quiz } from "./../quiz/quiz.schema";
import mongoose from 'mongoose';
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

    public async add(quizId:any) {
        try {
            const quiz = await Quiz.findById(quizId);

            if (quiz.startDate > Date.now()) {
                const liveQuiz = await LiveQuiz.findOne({ roomId: quizId });
                if (liveQuiz == null) {
                    const body: ILiveQuiz = {
                        roomId: quizId,
                        users: [],
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
    
    public async joinRoom(userId:any,quizId: any) {
        const result = await this.add(quizId);

        if (result.proceed) {
            const liveQuiz = await LiveQuiz.findOneAndUpdate({ roomId: quizId }, {
                $push: { "users": userId }
            },
                { new: true });
            
            return { proceed: true,roomId:liveQuiz.roomId };
        } else
        {
          return { proceed: false };
        }
    };

    public async getQuestions(userId:any,roomId: any) {
        const questions = await quizModel.start(userId, roomId);

        return questions;
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