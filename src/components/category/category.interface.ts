import { Document } from 'mongoose'
import { IUserModel } from '../user/user.schema';


export interface ICategory {
    name: string;
    numberOfLevels: number,
    creator: IUserModel['_id']
    icon?: string,
    active : boolean
}

export interface ICategoryModel extends ICategory, Document {
    add(): Promise<ICategoryModel>
}