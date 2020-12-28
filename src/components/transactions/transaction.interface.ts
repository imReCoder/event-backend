import { Document } from 'mongoose'
import { IUserModel } from '../user/user.schema';

export enum transactionType { CREDIT = "Credit", DEBIT = "Debit" }
export enum transactionStatus { TXN_SUCCESS = "TXN_SUCCESS", PENDING = "PENDING", TXN_FAILURE = "TXN_FAILURE" }

export interface ITransaction {
    userId: IUserModel['_id']
    amount: Number,
    type: string,
    metadata: {
        description: string,
        type: transactionType,
        sessionId?: string,
        voucherId?: string,
        mode?: string,
        offerId?: string,
        message?:string
    },
    status: transactionStatus,
    createdAt: Date
}

export interface ITransactionModel extends ITransaction, Document {
    add(): Promise<ITransactionModel>
}
