import { mongoDBProjectFields } from '../../lib/utils'
import { Category } from './category.schema'

class CategoryModel {

    private default = 'name  icon'

    public async fetchAll() {
        return await Category.find({})
    }

    public async fetchAllActive() {
        return await Category.find({ active: true }).select({...mongoDBProjectFields(this.default)})
    }

    public async delete(id: string) {
        await Category.deleteOne({ _id: id })
    }

    public async create(body:any,userId:string){
        console.log(userId);
        body.creator = userId;
        let c = new Category(body);
        c.add();
        return c;
    }

    public async addEventCount(id: string) {
        try {
            await Category.findOneAndUpdate({ _id: id }, {
                $inc: { "eventCount": 1 }
            }, {
                new: true
            });

            return { success: true };
        } catch (e) {
            throw new Error(e);
        }
    };
}

export default new CategoryModel()