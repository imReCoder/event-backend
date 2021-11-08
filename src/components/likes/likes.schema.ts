import { Document, Model, model, Schema, Types } from "mongoose";
import { ILikes } from "./likes.interface"

export interface ILikesModel extends ILikes, Document {
    addNewLike(): any;
}

export const LikeSchema: Schema = new Schema(
    {

        eventId: {
            type: Schema.Types.ObjectId,
            ref: "Event",
            required:true
        },
        userId:[ {
            type: Schema.Types.ObjectId,
            ref: "User"
        }],
    },
    {
        timestamps: true
    }
);

LikeSchema.methods.addNewLike = async function () {
    return this.save();
}


export const Like: Model<ILikesModel> = model<ILikesModel>("Like", LikeSchema);