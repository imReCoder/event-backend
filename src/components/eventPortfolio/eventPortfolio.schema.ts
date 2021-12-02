import { Document, Model, model, Schema, Types } from "mongoose";
import { NextFunction } from "express";
import { IEventPortfolio } from "./eventPortfolio.interface";
import bcrypt from "bcrypt";

export interface IEventPortfolioModel extends IEventPortfolio, Document {
  addNewEventPortfolio(): any;
}

export const EventPortfolioSchema: Schema = new Schema(
  {
    title: {
      type: String,
      minlength: 2,
      required: true,
    },
    coverImage: {
      type: String,
      default:
        "https://polbol-media.s3.ap-south-1.amazonaws.com/ic_user_dummy.jpg",
      required: true,
    },
    profileImage: {
      type: String,
    },
    about: {
      type: String,
    },
    gallery: [String],
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    follow: {
      type: Number,
      default: 0,
    },
    pastEvents: [
      {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
    upcomingEvents: [
      {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
    eventsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

EventPortfolioSchema.methods.addNewEventPortfolio = async function () {
  return this.save();
};

export const EventPortfolio: Model<IEventPortfolioModel> =
  model<IEventPortfolioModel>("EventPortfolio", EventPortfolioSchema);
