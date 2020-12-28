import { Document } from 'mongoose'

export interface IPool {
    user: string,
    roomId: string,

    amount: string
}

export interface IPoolModel extends Document, IPool {

}