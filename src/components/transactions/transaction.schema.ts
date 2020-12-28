import { Schema, Model, model } from 'mongoose'
import { ITransactionModel } from './transaction.interface'

const TransactionModel = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['Voucher', 'Coupon', 'Payment', 'Hint', 'AddRemoval', 'PollReward', 'IKC', 'Others'],
        required: true
    },
    metadata: {
        description: { type: String, required: true },
        type: { type: String, required: true, enum: ['Credit', 'Debit'] },
        sessionId: String,
        voucherId: String,
        mode: String,
        gateway: String,
        offerId: String,
        message: String,
    },
    status: {
        type: String,
        enum: ['TXN_SUCCESS', 'TXN_FAILURE', 'PENDING'],
        required: true
    }
}, {
    timestamps: true
})

TransactionModel.methods.add = async function () {
    return this.save()
}

export const Transaction: Model<ITransactionModel> = model<ITransactionModel>("Transaction", TransactionModel)