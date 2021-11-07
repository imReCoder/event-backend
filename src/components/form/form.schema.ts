import { Document, Model, model, Schema, Types } from "mongoose";
import { IForm } from "./form.interface";

export interface IFormModel extends IForm, Document {
    addNewForm(): any;
}

export const FormSchema: Schema = new Schema(
    {
        title: {
            type: String,
            minlength: 2,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        
        creator: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },

        eventId: {
            type: String,
            required:true
        },
        
        questions: [{
            questionText: String,
            questionImage: { type: String, default: "" },
            isRequired: Boolean,
            questiontype:String,
            options: [{
                optionText: String,
                optionImage: { type: String, default: "" },
            }]
        }],
    },
    {
        timestamps: true
    }
);

FormSchema.methods.addNewForm = async function () {
    return this.save();
}


export const Form : Model<IFormModel> = model<IFormModel>("Form", FormSchema);