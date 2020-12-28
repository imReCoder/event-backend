import { Show } from './show.schema';
import { Category } from '../category/category.schema'
import { IShowModel } from './show.interface'
import { HTTP400Error } from "../../lib/utils/httpErrors";
import { ICategoryModel } from '../category/category.interface';
import { ObjectID } from 'bson'
import { isValidMongoId, pruneFields } from "../../lib/helpers";
import { mongoDBProjectFields } from "../../lib/utils";
import { Award } from '../awards/award.schema'

class ShowModel {

    private default = 'title icon youtube_link web_link expiry hidden';
    private categoryFields = 'title icon sponsorName sponsorName_hindi sponsorImage';

    private awardFields = 'nominations language_hindi language_english heading expiredHeading expiredHeading_hindi heading_hindi createdAt image image_hindi credit credit_hindi categories extraData likesCount category subcategory';

    private async addCategoryToShow(body: any): Promise<ICategoryModel> {
        let c = new Category(body);
        return c.save();
    }

    async createShow(body: any): Promise<IShowModel> {
        try {
            const temp = { ...body }
            temp.lifeSpan = new Date(`${body.exp_date} ${body.exp_time}`)
            console.log(temp)
            const s: IShowModel = new Show(temp);
            for (let category of body.categories) {
                category.showId = s._id;
                this.addCategoryToShow(category);
            }
            const data = await s.add();
            return data;
        } catch (e) {
            console.log(e);
            throw new HTTP400Error(e);
        }
    }

    async fetchCategoryListOfaShow(show: string) {
        try {
            return Category.find({ showId: new ObjectID(show) }).select(this.categoryFields);
        } catch (e) {
            throw new HTTP400Error(e);
        }
    }

    async fetchShowList() {
        return await Show.find({}).select(this.default);
    }

}

export default new ShowModel();