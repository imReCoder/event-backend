import { IQuizModel } from './quiz.interface';
import { model, Model, Schema } from "mongoose";
import Crypto from 'crypto'

export const quizSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    timeAlloted: {
      type: Number
    },
    creator: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    questions: [{
      level: { type: Number },
      category: { type: Schema.Types.ObjectId, ref: 'Category' },
      questionsCount: { type: Number }
    }],
    metadata: {
      maxScore: Number,
      maxQuestions: Number,
      maxPlayers: Number,
      maxAttempts: Number,
      minPlayers: Number
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    code: {
      type: String,
    },
    scheduled: Boolean,
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    icon: {
      type: String,
      required: true,
      default: 'https://polbol-media.s3.ap-south-1.amazonaws.com/ic_user_dummy.jpg'
    },
    hidden: {
      type: Boolean,
      default: false
    },
    visibility: {
      type: String,
      enum: ['public', 'private'],
      required: true,
      default: 'public'
    },
    poolAmount: { type: Number, default: 0 },
    isFreebie: Boolean,
    totalRegisterations: Number,
    status:{
      type:String,
      enum:['active','dropped']
    }
  },
  {
    timestamps: true
  }
);


quizSchema.pre<IQuizModel>('save', async function () {
  this.code = Crypto.randomBytes(3).toString('hex');
})

quizSchema.methods.add = async function () {
  return this.save();
};

export const Quiz: Model<IQuizModel> = model<IQuizModel>("QuizRoom", quizSchema);
