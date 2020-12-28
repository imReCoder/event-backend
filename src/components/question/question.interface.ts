import { Document } from "mongoose"
import { ICategoryModel } from '../category/category.interface'

export interface IQuestion {
    category: ICategoryModel['_id'],
    level: number,
    content: {
        isText: boolean,
        question: string,
        answerImage?: string
    },
    options: { isText: boolean, text?: string, image?: string ,_id : string}[],
    hints: { isText: boolean, text?: string, image?: string, cost: number }[],
    creator: string,
    answer: string,
    points:number,
    archived:boolean
}

export interface IQuestionModel extends IQuestion, Document {
    add(): Promise<IQuestionModel>
}