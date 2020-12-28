import { Schema, Model, model } from 'mongoose'
import { IShowModel } from './show.interface'

let ShowSchema = new Schema({
    title: { type: String, required: true },
    icon: { type: String, required: true, default: 'https://polbol-media.s3.ap-south-1.amazonaws.com/ic_user_dummy.jpg' },
    youtube_link: String,
    web_link: String,
    expiry: Date,
    hidden: {
        type: Boolean,
        default: true,
        required: true
    }
})

ShowSchema.methods.add = async function(){
    return this.save()
}

export const Show: Model<IShowModel> = model<IShowModel>('Show', ShowSchema)