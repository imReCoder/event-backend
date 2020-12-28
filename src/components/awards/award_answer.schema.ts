import { IAwardAnswer } from './award.interface';
import { Document, Model, model, Schema } from "mongoose";

export interface IAwardAnswerModel extends IAwardAnswer, Document {
  add(): Promise<IAwardAnswerModel>;
}

export const awardAnswerSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    award: {
      type: Schema.Types.ObjectId,
      ref: "Award"
    },
    answer: {
      type: Number,
      required: true
    },
    comment: {
      type: String,
    },
    metadata: {
      age: Number,
      gender: String,
      region: String,
      subRegion: String,
    }
  },
  {
    timestamps: true
  }
);

awardAnswerSchema.index({ user: 1, award: 1 }, { unique: true });
awardAnswerSchema.methods.add = async function () {
  return this.save();
};

awardAnswerSchema.on('index', function (error) {
  // "_id index cannot be sparse"
  console.log("index");
  console.log(error.message);
});

export const AwardAnswer: Model<IAwardAnswerModel> = model<IAwardAnswerModel>("awardAnswer", awardAnswerSchema);
