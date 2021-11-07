import { generateToken, imageUrl, isValidMongoId, otpGenerator } from "../../lib/helpers";
import { Follow } from "./follow.schema";
import { IFollowModel } from "./follow.schema";
import socialAuth from "./../../lib/middleware/socialAuth";
import bcrypt from 'bcrypt';
// import { sendMessage } from "./../../lib/services/textlocal";
import { HTTP400Error, HTTP401Error } from "../../lib/utils/httpErrors";

export class FollowModel {

    public async addEvent(userId: string, eventId: string) {
        try {
            const body = {
                userId,
                eventId
            }
            const q: IFollowModel = new Follow(body);
            const data: IFollowModel = q.add();
            return data;
        } catch (e) {
            throw new Error(e);
        }
    };

    public async removeEvent(userId: string, eventId: string) {
        try {
            const data = await Follow.findOneAndUpdate({ userId }, {
                $set: { "eventId": null }
            }, {
                new: true
            });

            return data;
        } catch (e) {
            throw new Error(e);
        }
    };

    public async addEventPortfolio(userId: string, eventPortfolioId: string) {
        try {
            const body = {
                userId,
                eventPortfolioId
            }
            const q: IFollowModel = new Follow(body);
            const data: IFollowModel = q.add();
            return data;
        } catch (e) {
            throw new Error(e);
        }
    };

    public async removeEventPortfolio(userId: string, eventPortfolioId: string) {
        try {
            const data = await Follow.findOneAndUpdate({ userId }, {
                $set: { "eventPortfolioId": null }
            }, {
                new: true
            });

            return data;
        } catch (e) {
            throw new Error(e);
        }
    };

    public async isUserExist(userId: string) {
        try {
            const data = await Follow.findOne({ userId });

            if (data) {
                return { alreadyExist: true };
            } else
            
                
                return { alreadyExist: false };
        } catch (e) {
            throw new Error(e);
        }
    }
}

export default new FollowModel();