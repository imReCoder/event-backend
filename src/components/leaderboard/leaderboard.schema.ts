import { Schema, Model, model } from 'mongoose'
import { ILeaderBoardModel } from './leaderboard.interface';

const leaderBoardSchema = new Schema({
    roomId: { type: Schema.Types.ObjectId, ref: 'QuizRoom', required: true },
    result: [],
    last_count: { type: Number, required: true }
});

export const LeaderBoard: Model<ILeaderBoardModel> = model<ILeaderBoardModel>('LeaderBoard', leaderBoardSchema)