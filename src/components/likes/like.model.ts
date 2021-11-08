import { generateToken, imageUrl, isValidMongoId, otpGenerator } from "../../lib/helpers";
import { ILikes } from "./likes.interface";
import { ILikesModel, Like } from "./likes.schema";
import socialAuth from "./../../lib/middleware/socialAuth";
import bcrypt from 'bcrypt';
// import { sendMessage } from "./../../lib/services/textlocal";
import { HTTP400Error, HTTP401Error } from "../../lib/utils/httpErrors";
import { IFormModel } from "../form/form.schema";
import mongoose from "mongoose";
export class LikeModel {
    public async fetchAll() {

        const data = await Like.find();

        return data;
    }

    public async fetch(id: string) {
        const data = await Like.findById(id);
        return data;
    }

    public async update(id: string, body: any) {
        const data = await Like.findByIdAndUpdate(id, body, {
            runValidators: true,
            new: true
        })

        return data;
    }

    public async delete(id: string) {
        await Like.deleteOne({ _id: id });
    }

    
    public async add(body: ILikesModel) {
        try {
            console.log(body);
            const q: ILikesModel = new Like(body);
            console.log("hiii", q);
            const data: ILikesModel = await q.addNewLike();
            console.log(data);
            return { data, alreadyExisted: false };
        } catch (e) {
            throw new Error(e);
        }
    };

    public async addLike(eventId:string,userId: string) {
        try {
            await Like.findOneAndUpdate({ eventId: eventId }, {
                $push: { "userId": userId }
            },
                { new: true });
        } catch (e) {
            throw new HTTP400Error(e);
        }
    };

    public async removeLike(eventId: string, userId: string) {
        try {
            await Like.findOneAndUpdate({ eventId: eventId }, {
                $pull: { "userId": userId }
            },
                { new: true });
        } catch (e) {
            throw new HTTP400Error(e);
        }
    };

}

export default new LikeModel();