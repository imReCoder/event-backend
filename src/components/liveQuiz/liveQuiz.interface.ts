import { Document } from "mongoose"
import { ICategoryModel } from '../category/category.interface'
import { IQuizModel } from "../quiz/quiz.interface"
import { IUserModel } from "../user/user.schema"

export interface ILiveQuiz {
    roomId: IQuizModel["_id"],
    users:Array<IUserModel["_id"]>
}

export interface ILiveQuizModel extends ILiveQuiz, Document {
    add(): Promise<ILiveQuizModel>
}