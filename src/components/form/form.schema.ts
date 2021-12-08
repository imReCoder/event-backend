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
            ref: "User",
        },

        eventId: {
            type: Schema.Types.ObjectId,
            required:true,
            ref:"Event"
        },
        
        questions: [{
            questionText: {type:String,required:true},
            questionImage: { type: Buffer, default: "" },
            isRequired: {type:Boolean,required:true},
            questiontype:{
                type:String,
                required:true,
                enum:['MCQ','DROPDOWN','TEXT_INPUT','PARAGRAPH',"RADIO_BUTTON","NUMBER"]
            },
            forAllTickets:Boolean,
            seletedTickets:{
                type:[Schema.Types.ObjectId],
                ref:"Ticket"
            },
            options: [{
                optionText: String,
                optionImage: { type: Buffer, default: "" },
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