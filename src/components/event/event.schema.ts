import { Document, Model, model, Schema } from "mongoose";
import { NextFunction } from "express";
import { IEvent } from "./event.interface";
import bcrypt from 'bcrypt'

export interface IEventModel extends IEvent, Document {
    addNewEvent(): any;
}

export const EventSchema: Schema = new Schema(
    {
        title: {
            type: String,
            minlength: 2,
            required: true
        },
        amount: {
            type: String,
            required: true
        },
        category: {
            type: Schema.Types.ObjectId,
            ref:"Category"
        },
        information: {
            type:String
        },
        gallery: [String],
        startDate: {
            type: Date,
            required:true
        },
        endDate: {
            type: Date,
            required:true
        },
        type: {
            type: String,
            enum: ["online", "physical","virtual"],
            required: true
        },
        likes: {
            type: Number,
            default:0
        },
        shares: {
            type: Number,
            default:0
        },
        isFreebie: {
            type: Boolean,
            required:true
        },
        creator: {
            type: String,
            ref:"User"
        },
        eventPortfolioId: {
            type: String,
            ref:"EventPortfolio"
        },
        onlinePlatform: {
            type:String
        },
        venuePlace: {
            type:String,
        },
        venueLocation: {
            type:String
        }
    },
    {
        timestamps: true
    }
);

EventSchema.methods.addNewEvent = async function () {
    return this.save();
}


export const Event: Model<IEventModel> = model<IEventModel>("Event", EventSchema);