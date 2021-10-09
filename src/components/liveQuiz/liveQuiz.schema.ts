import { ILiveQuizModel } from './liveQuiz.interface';
import { Schema, model, Model } from 'mongoose'

export const livequizSchema: Schema = new Schema({
    roomId: {
        type: Schema.Types.ObjectId,
        ref: 'Quizrooms',
        required: true
    },
    users: [{
        userId: Schema.Types.ObjectId,
        socketId:String
    }],
})


livequizSchema.methods.add = async function () {
    return await this.save()
}

export const LiveQuiz: Model<ILiveQuizModel> = model<ILiveQuizModel>("LiveQuiz", livequizSchema);