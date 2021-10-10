import { Quiz } from "./../quiz/quiz.schema";
import mongoose from 'mongoose';
import { IQuiz, IQuizModel } from "./../quiz/quiz.interface";
import { isValidMongoId, pruneFields } from "../../lib/helpers";
import { HTTP400Error } from "../../lib/utils/httpErrors";
import { mongoDBProjectFields } from "../../lib/utils";
import Question from '../question/question.model'
import { ILiveQuizLeaderboardModel, ILiveQuizLeaderboard } from "./liveQuizLeaderboard.interface";
import { liveQuizLeaderboard }  from "./liveQuizLeaderboard.schema";
import quizModel from "../quiz/quiz.model";

export class LiveQuizLeaderboardModel {

    public async add(body: ILiveQuizLeaderboard) {
        body.scores = [];
        const leaderboard: ILiveQuizLeaderboardModel = new liveQuizLeaderboard(body);
        
        const data = await leaderboard.add();

        return data;
    };

    public async updateleaderboard(body: any) {

        const isLeaderboard = await this.isLeaderboardAlreadyExist(body.roomId);
        if (!isLeaderboard.alreadyExist) {
            const leaderboard = await this.add(body);

            if (leaderboard != null) {
                await liveQuizLeaderboard.findOneAndUpdate({ roomId: body.roomId }, {
                    $push: { "scores": { userId: body.userId, score: body.score } }
                },
                    {
                        new: true,
                    }
                );
            }
        } else
        {
            const isUser = await this.isUserExist(body.roomId, body.userId);

            if (isUser.alreadyExist) {
                await this.updateScore(body.roomId, body.userId,body.score);
            } else
            {
                await liveQuizLeaderboard.findOneAndUpdate({ roomId: body.roomId }, {
                    $push: { "scores": { userId: body.userId, score: body.score } }
                },
                    {
                        new: true,
                    }
                );
            }
        };
    };

    public async isUserExist(roomId:string,userId: string) {
        const leaderboard = await liveQuizLeaderboard.findOne({ $and: [{ roomId: roomId }, { scores: { $elemMatch: { userId: userId } } }] });

        console.log(leaderboard);

        if (leaderboard) {
            return { alreadyExist: true };
        }

        return { alreadyExist: false };
    };

    public async updateScore(roomId: string, userId: string,point:number) {
        const leaderboard = await liveQuizLeaderboard.findOneAndUpdate({ $and: [{ roomId: roomId }, { scores: { $elemMatch: { userId: userId } } }] }, {
            $inc:{"scores.$.score":point}
        },
            {
            new:true
            }
        );
        
        console.log(leaderboard);
    };

    public async isLeaderboardAlreadyExist(roomId:any) {
        const leaderboard = await liveQuizLeaderboard.findOne({ roomId });

        if (leaderboard == null) {
            return { alreadyExist: false };
        }

        return { alreadyExist: true };
    };
}
export default new LiveQuizLeaderboardModel();