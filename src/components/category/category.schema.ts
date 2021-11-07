import { Schema, Model, model } from 'mongoose'
import { ICategoryModel } from './category.interface'
// import Wallet from '../wallet/wallet.model'

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    icon: {
        type: String,
        default: 'https://polbol-media.s3.ap-south-1.amazonaws.com/ic_user_dummy.jpg',
        required: true
    },
    active: {
        type: Boolean,
        default: false
    },
    eventCount: {
        type: Number,
        default:0
    }
}, {
    timestamps: true
})

CategorySchema.methods.add = async function () {
    // await Wallet.updateNewAddedCategory(this._id);
    await this.save()
}

export const Category: Model<ICategoryModel> = model<ICategoryModel>("Category", CategorySchema); 