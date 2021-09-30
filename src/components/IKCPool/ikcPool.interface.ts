import { Document } from 'mongoose'

export enum PoolStatus { PENDING = 'pending', DEDUCTED = 'deducted' }

export interface IPool {
    userId: string,
    roomId: string,

    amount: string,

    status: string,
    notify: boolean
}

export interface IPoolModel extends Document, IPool {

}