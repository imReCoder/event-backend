import {IAwardResult} from './award.interface';
import {Document, Model, model, Schema} from "mongoose";

export interface IAwardResultModel extends IAwardResult, Document {
  add(): Promise<IAwardResultModel>;
}

export const awardResultSchema: Schema = new Schema(
  {
    award: {
      type: Schema.Types.ObjectId,
      ref: "award"
    },
    nominees:{},
    winner:{},
    totalVotes:{},
    region_filter: Boolean,
    last_count: Number
  },
  {
    timestamps: true
  }
);

awardResultSchema.methods.add = async function () {
  return this.save();
};

export const AwardResult: Model<IAwardResultModel> = model<IAwardResultModel>("AwardResult", awardResultSchema);
