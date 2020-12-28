// you can move this interface at any common place
// for now I wil stick with in components flow.
import { Document } from "mongoose";
import { ICategoryModel } from '../category/category.interface'

export enum QuizVisibility { PUBLIC = 'public', PRIVATE = 'private' }

export interface IQuiz {
  title: string;
  timeAlloted?: number;
  creator: string;
  questions: { level: number, category: ICategoryModel['_id'], questionsCount: number }[];
  metadata: {
    maxScore: number;
    maxQuestions: number;
    maxPlayers: number;
  }
  categoryId: string,
  icon: string,
  level: number,
  code: string,
  visibility: string,

  poolAmount: number
}

export interface IQuizModel extends IQuiz, Document {
  add(): Promise<IQuizModel>;
}


