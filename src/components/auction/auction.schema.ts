import { Document, Model, model, Schema, Types } from "mongoose";
import { IAuction } from "./auction.interface"

export interface IAuctionModel extends IAuction, Document {
    add(): any;
}


export const AuctionSchema: Schema = new Schema(
    {
        auctionEventId: {
            type: Schema.Types.ObjectId,
            ref:"AuctionEvent"
        },
        title: {
            type: String,
            required:true
        },

        images: [{
            type:String
        }],

        description: {
            type:String,
            required:true
        },

        startDate: {
            type: Date,
            required:false
        },

        endDate: {
            type: Date,
            required: false
        },

        startingBid: {
            type: Number,
            required:true
        },

        currentBid: {
            user: {
                type: Schema.Types.ObjectId,
                ref:"User"
            },
            amount:Number
        },

        previousBid: [{
            user: {
                type: Schema.Types.ObjectId,
                ref: "User"
            },
            amount: Number
        }],

        creator: {
            type: String,
            required:true
        },
    },
    {
        timestamps: true
    }
);

AuctionSchema.methods.add = async function () {
    return this.save();
}


export const Auction: Model<IAuctionModel> = model<IAuctionModel>("Auction", AuctionSchema);