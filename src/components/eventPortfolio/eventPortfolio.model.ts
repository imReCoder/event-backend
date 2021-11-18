import { generateToken, imageUrl, isValidMongoId, otpGenerator } from "../../lib/helpers";
import { EventPortfolio } from "./eventPortfolio.schema";
import { IEventPortfolioModel } from "./eventPortfolio.schema";
import socialAuth from "./../../lib/middleware/socialAuth";
import bcrypt from 'bcrypt';
// import { sendMessage } from "./../../lib/services/textlocal";
import { HTTP400Error, HTTP401Error } from "../../lib/utils/httpErrors";

export class EventPortfolioModel {
    public async fetchAll() {

        const data = EventPortfolio.find();

        return data;
    }

    public async fetch(id: string) {
        const data = EventPortfolio.findById(id);
        return data;
    }

    public async update(id: string, body: any) {
        const data = await EventPortfolio.findByIdAndUpdate({ _id: id }, body, {
            runValidators: true,
            new: true
        })

        return data;
    }

    public async delete(id: string) {
        await EventPortfolio.deleteOne({ _id: id });
    }

    public async add(body: IEventPortfolioModel) {
        try {
            console.log(body);
            
            const q: IEventPortfolioModel = new EventPortfolio(body);
            console.log("hiii", q);
            const data: IEventPortfolioModel = await q.addNewEventPortfolio();
            console.log(data);
            return { data, alreadyExisted: false };
        } catch (e) {
            throw new HTTP400Error(e);
        }
    };

    public async addUpcomingEvents(id: string,eventId:string) {
        try {
            console.log(id);
            const data = await EventPortfolio.findOneAndUpdate({ _id: id }, {
                $push: { "upcomingEvents": eventId }
            },
                {
                    new: true
                });
            
            return { data, success: true };
        } catch (e) {
            throw new HTTP400Error(e);
        }
    };

    public async addPastEvents(id: string,eventId:string) {
        try {
            const data = await EventPortfolio.findOneAndUpdate(id, {
                $push: { "pastEvents": eventId }
            },
                {
                    new: true
                });
            
            return data;
        } catch (e) {
            throw new HTTP400Error(e);
        }
    };

    public async addEvent(id:string) {
        try {
            const data = await EventPortfolio.findOneAndUpdate({ _id: id }, {
                $inc: { "eventsCount": 1 }
            },
                {
                    new: true
                });
            
            return { data, success: true };
        } catch (e) {
            throw new HTTP400Error(e);
        }
    };

    public async addFollow(id:string) {
        try {
            const data = await EventPortfolio.findOneAndUpdate(id, {
                $inc: { "follow": 1 }
            },
                {
                    new: true
                });
            
            return data;
        } catch (e) {
            throw new HTTP400Error(e);
        }
    };

    public async isFollowerExist(id: string, followerId: string) {
        try {
            const data = await EventPortfolio.findOne({ $and: [{ _id: id }, { followers: followerId }] });
            console.log(data);
            return data;
        } catch (e) {
            throw new HTTP400Error(e);
        }
    }

    public async addFollower(id: string, followerId: string) {
        try {
            const exist = await this.isFollowerExist(id, followerId);

            if (!exist) {
                const data = await EventPortfolio.findOneAndUpdate({ _id: id }, {
                    $push: { "followers": followerId },
                    $inc: { "follow": 1 }
                }, {
                    new: true
                });

                return data;
            } else {
                throw new HTTP400Error("User already exist as a follower");
            }
        } catch (e) {
            throw new HTTP400Error(e.message);
        }
    };


    
    public async removeFollower(id: string, followerId: string) {
        try {
            const exist = await this.isFollowerExist(id, followerId);

            if (exist) {
                const data = await EventPortfolio.findOneAndUpdate({ _id: id }, {
                    $pull: { "followers": followerId },
                    $inc: { "follow": -1 }
                }, {
                    new: true
                });

                return data;
            } else {
                throw new HTTP400Error("User doesn't exist as a follower");
            }
        } catch (e) {
            throw new HTTP400Error(e.message);
        }
    };


    public async addGallery(id: string, filelocation: string) {
        try {
            console.log(id);
            const data = await EventPortfolio.findOneAndUpdate({ _id: id }, {
                $push: { "gallery": filelocation }
            },
                { new: true });

            return data;
        } catch (e) {
            throw new HTTP400Error(e.message);
        }
    }

}

export default new EventPortfolioModel();