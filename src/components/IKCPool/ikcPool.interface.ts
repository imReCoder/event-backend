import { Document } from 'mongoose'

export enum PoolStatus { PENDING = 'pending', DEDUCTED = 'deducted',DROPPED = 'dropped',CANCELLED = 'cancelled',ACCEPTED = 'accepted' }

export interface IPool {
    userId: string,
    roomId: string,

    amount: string,

    status: string,
    notify: boolean
}

export interface IPoolModel extends Document, IPool {

}