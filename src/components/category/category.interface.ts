import { Document } from 'mongoose';

export interface ICategory {
    title: string;
    icon: string;

    sponsorName?: string,

    sponsorName_hindi?: String,

    sponsorImage?: string

    showId: string
}

export interface ICategoryModel extends ICategory, Document {

}