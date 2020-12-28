import { IResultModel } from './result.interface'
import { model, Model, Schema } from 'mongoose'

export const ResultSchema: Schema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    quizId: {
        type: Schema.Types.ObjectId,
        ref: 'Quiz'
    },
    score: { type: Number, required: true },
    questionsAnswered: [{
        quesId: { type: Schema.Types.ObjectId, ref: 'Question' },
        answerMarked: String,
        isCorrect: Boolean,
        pointScored: Number
    }],
    maxLevelUnlockedAtStart: Number,
    maxLevelUnlockedAtEnd: Number,
    countCorrect: { type: Number, default: 0 },
    accuracy: Number
}, {
    timestamps: true
})

ResultSchema.methods.add = async function () {
    return await this.save()
}

ResultSchema.methods.playedBefore = async function () {
    let exist = await model<IResultModel>('Score').findOne({ userId: this.userId, quizId: this.quizId });
    if (exist) {
        exist.score = 0;
        return await exist.save();
    } else {
        return null;
    }
}

export const Result: Model<IResultModel> = model<IResultModel>('Result', ResultSchema)