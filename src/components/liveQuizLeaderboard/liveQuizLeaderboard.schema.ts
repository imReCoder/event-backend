import { ILiveQuizLeaderboardModel } from "./liveQuizLeaderboard.interface";
import { model, Model, Schema } from "mongoose";
import Crypto from 'crypto'

export const livequizleadrboardSchema: Schema = new Schema(
    {
        roomId: {
            type: Schema.Types.ObjectId,
            ref: "Quizrooms",
            required:true
        },
        scores: [
            {
                userId: Schema.Types.ObjectId,
                score:Number
            }
        ]
    }
);



livequizleadrboardSchema.methods.add = async function () {
  return this.save();
};

export const liveQuizLeaderboard: Model<ILiveQuizLeaderboardModel> = model<ILiveQuizLeaderboardModel>("LiveQuizLeaderboard", livequizleadrboardSchema);
