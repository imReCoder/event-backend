import { IQuestionModel } from './question.interface'
import { Schema, model, Model } from 'mongoose'

export const quesSchema: Schema = new Schema({
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    level: {
        type: Number,
        min: 0,
        max: 10,
        required: true
    },
    content: {
        isText: { type: Boolean, required: true },
        question: {
            type: String,
            required: true
        },
        answerImage: {
            type: String,
        }
    },
    options: [{
        isText: { type: Boolean, required: true },
        text: String,
        image: {
            type: String,
            default: 'https://polbol-media.s3.ap-south-1.amazonaws.com/ic_user_dummy.jpg'
        }
    }],
    hints: [{
        isText: { type: Boolean, required: true },
        text: String,
        image: {
            type: String,
            default: 'https://polbol-media.s3.ap-south-1.amazonaws.com/ic_user_dummy.jpg'
        },
        cost: { type: Number, required: true }
    }],
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    answer: {
        type: String,
        required: true,
    },
    points: { type: Number, required: true },
    archived: {
        type: Boolean,
        required: true,
        default: false
    }
})


quesSchema.methods.add = async function () {
    return await this.save()
}

export const Question: Model<IQuestionModel> = model<IQuestionModel>("Question", quesSchema);