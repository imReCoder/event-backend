import { Schema, Model, model } from 'mongoose'
import { ICategoryModel } from './category.interface';

let categorySchema = new Schema({
    title: { type: String, required: true },
    icon: { type: String, required: true },

    sponsorName: String,

    sponsorName_hindi: String,

    sponsorImage: String,

    showId: { type: Schema.Types.ObjectId, ref: 'Show', required: true },
});

export const Category: Model<ICategoryModel> = model<ICategoryModel>('Category', categorySchema);