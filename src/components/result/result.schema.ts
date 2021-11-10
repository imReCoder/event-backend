import { Document, Model, model, Schema, Types } from "mongoose";
import { IResult } from "./result.interface"

export interface IResultModel extends IResult, Document {
    addNewResult(): any;
}

export const ResultSchema: Schema = new Schema(
    {

        formId: {
            type: Schema.Types.ObjectId,
            ref: "Form"
        },

        mcq: [{
            questionId: String,
            options: [{
                optionId: String,
                count: {
                    type: Number,
                    default:0
                }
            }],
            totalOptionCount: {
                type: Number,
                default:0
            }
        }],
        
        number: [{
            questionId: String,
            answer:[Number]
        }]
    },
    {
        timestamps: true
    }
);

ResultSchema.methods.addNewResult = async function () {
    return this.save();
}


export const Result: Model<IResultModel> = model<IResultModel>("Result", ResultSchema);