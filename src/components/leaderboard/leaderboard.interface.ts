import { Document } from 'mongoose'

export interface ILeaderBoard {
    roomId: string,
    result: [],
    last_count: number
}

export interface ILeaderBoardModel extends Document, ILeaderBoard {

}