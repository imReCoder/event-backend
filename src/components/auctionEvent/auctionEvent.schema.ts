import { Document, Model, model, Schema, Types } from "mongoose";
import { IAuctionEvent } from "./auctionEvent.interface"

export interface IAuctionEventModel extends IAuctionEvent, Document {
    add(): any;
}


export const AuctionEventSchema: Schema = new Schema(
    {
        title: {
            type: String,
            required: true
        },

        creator: {
            type: Schema.Types.ObjectId, 
            ref:"User",
            required: true
        },

        startDate: {
            type: Date,
            required:true
        },

        endDate: {
            type: Date,
        },

        icon: {
            type:String
        },

        type: {
            type: String,
            enum: ['live', 'timed'],
            required:true
        },

        coverImage: {
            type:String
        },

        auctionItems: [
            {
                type: Schema.Types.ObjectId,
                ref:"Auction"
            }
        ]
    },
    {
        timestamps: true
    }
);

AuctionEventSchema.methods.add = async function () {
    return this.save();
}


export const AuctionEvent: Model<IAuctionEventModel> = model<IAuctionEventModel>("AuctionEvent", AuctionEventSchema);