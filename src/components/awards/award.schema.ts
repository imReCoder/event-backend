import { IAward } from './award.interface';
import { Document, Model, model, Schema } from "mongoose";

export interface IAwardModel extends IAward, Document {
  add(): Promise<IAwardModel>;
}

export const awardSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Show'
    },
    heading: {
      type: String,
      minlength: 2,
      required: true
    },
    heading_hindi: {
      type: String,
      minlength: 2,
    },
    expiredHeading: {
      type: String,
      minlength: 2,
      required: true
    },
    expiredHeading_hindi: {
      type: String,
      minlength: 2,
    },
    image: {
      type: String,
      required: true
    },
    awardvideo: {
      type: String
    },
    category_image: {
      type: String,
      default: 'https://polbol-media.s3.ap-south-1.amazonaws.com/ic_user_dummy.jpg',
      required: true
    },
    nominations: [{
      name: {
        type: String,
        required: true
      },
      image: {
        type: String,
        required: true
      },
      name_hindi: String,
      weblink: {
        type: String,
        required: true
      },
      weblink_hindi: {
        type: String,

      },

      ytlink: String,
      ytlink_hindi: String,
      key: Number
    }],
    jurys: [{
      name: {
        type: String,
        required: true
      },
      image: {
        type: String,
        required: true
      },
      name_hindi: String,
      comments: {
        type: String
      },
      comments_hindi: String,
      medialink: String,
      medialink_hindi: String,
      key: Number,
      answer: {
        type: Number
      },
      designation: String,
      organization: String
    }],
    hidden: {
      type: Boolean,
      default: false
    },
    age_filter_min: Number,
    age_filter_max: Number,
    gender_filter: String,
    region_filter: String,

    language_hindi: {
      type: Boolean,
      required: true
    },
    language_english: {
      type: Boolean,
      required: true
    },
    likesCount: {
      type: Number,
      default: 0
    },
    juryWeightage: {
      type: Number,
      required: true,
      default: 50
    },
    audienceWeightage: {
      type: Number,
      required: true,
      default: 50
    },
    category: String,
    voteCount: Number,
  },
  {
    timestamps: true
  }
);

awardSchema.index({ age_filter_min: 1 });
awardSchema.index({ age_filter_max: 1 });
awardSchema.index({ gender_filter: 1 });
awardSchema.index({ region_filter: 1 });
awardSchema.methods.add = async function () {
  return this.save();
};

export const Award: Model<IAwardModel> = model<IAwardModel>("award", awardSchema);
