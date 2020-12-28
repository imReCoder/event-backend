import { Document } from 'mongoose'

export interface IShow {
    title: string,
    hindi_title: string,
    icon: string,
    youtube_link: string,
    web_link: string;
    expiry: Date;
    active: Boolean,
}

export interface IShowModel extends IShow, Document {
    add(): Promise<IShowModel>
}
