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
    maxWinner: number;
    maxScore: number;
    maxQuestions: number;
    maxPlayers: number;
    minPlayers: number;
  }
  lastDateToRegister:Date,
  categoryId: string,
  icon: string,
  level: number,
  code: string,
  visibility: string,

  startDate: any,
  
  endDate:any,

  poolAmount: number,
  scheduled: boolean,
  totalRegistrations: Number,

  prizes: Array<number>,
  
  isFreebie:boolean,

  status:string,
}

export interface IQuizModel extends IQuiz, Document {
  add(): Promise<IQuizModel>;
}


