// you can move this interface at any common place
// for now I wil stick with in components flow.
import { Document } from "mongoose";
// import { ICategoryModel } from '../category/category.interface'

// export enum QuizVisibility { PUBLIC = 'public', PRIVATE = 'private' }

export interface ILiveQuizLeaderboard {
    roomId: string,
    scores:Array<Object>
}

export interface ILiveQuizLeaderboardModel extends ILiveQuizLeaderboard, Document {
  add(): Promise<ILiveQuizLeaderboardModel>;
}


