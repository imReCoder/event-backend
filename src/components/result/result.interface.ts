// you can move this interface at any common place
// for now I wil stick with in components flow.
import { Document } from "mongoose";
import { IQuizModel } from "../quiz/quiz.interface"

export interface IResult {
    userId: string;
    quizId: IQuizModel['_id'];
    score: number,
    questionsAnswered: { quesId: string, answerMarked: string, isCorrect: boolean, pointScored: number }[],
    countCorrect: number,
    maxLevelUnlockedAtStart: number,
    maxLevelUnlockedAtEnd: number,
    accuracy?: Number
}

export interface IResultModel extends IResult, Document {
    add(): Promise<IResultModel>;
    playedBefore(): Promise<IResultModel>
}


