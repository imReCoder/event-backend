import { Document, Model, model, Schema, Types } from "mongoose";
import { IResponse } from "./response.interface";

export interface IResponseModel extends IResponse, Document {
    addNewResponse(): any;
}

export const ResponseSchema: Schema = new Schema(
    {   
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },

        formId: {
            type: Schema.Types.ObjectId,
            ref: "Form"
        },
        
        answers: [{
            questionId: String,
            questionText:String,
            answerId: String,
            answerText: String,
            questionType:String
        }],
    },
    {
        timestamps: true
    }
);

ResponseSchema.methods.addNewResponse = async function () {
    return this.save();
}


export const Response : Model<IResponseModel> = model<IResponseModel>("Response", ResponseSchema);