import { Document, Model, model, Schema, Types } from "mongoose";
import { NextFunction } from "express";
import { IFollow } from "./follow.interface";
import bcrypt from 'bcrypt'

export interface IFollowModel extends IFollow, Document {
    add(): any;
} 
export const FollowSchema: Schema = new Schema(
    {
        userId: {
            type: String,
            ref:"User",
            required: true
        },
        eventPortfolioId: {
            type: String,
            ref:"EventPortfolio"
        },
        eventId: {
            type: String,
            ref:"Event"
        },
    },
    {
        timestamps: true
    }
);

FollowSchema.methods.add = async function () {
    return this.save();
}


export const Follow: Model<IFollowModel> = model<IFollowModel>("Follow", FollowSchema);