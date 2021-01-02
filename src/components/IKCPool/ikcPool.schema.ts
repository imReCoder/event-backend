import { Schema, Model, model } from 'mongoose'
import { IPoolModel } from './ikcPool.interface'

let ikcPoolSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    roomId: { type: Schema.Types.ObjectId, ref: 'quizRoom', required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'deducted'], required: true },
    notify: Boolean
});

ikcPoolSchema.index({ userId: 1, roomId: 1 }, { unique: true })

export const ikcPool: Model<IPoolModel> = model<IPoolModel>('ikcPool', ikcPoolSchema);