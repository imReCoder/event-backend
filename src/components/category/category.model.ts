import { mongoDBProjectFields } from '../../lib/utils'
import { Category } from './category.schema'

class CategoryModel {

    private default = 'name numberOfLevels icon'

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
        body.creator = userId
        let c = new Category(body);
        return c.add()
    }
}

export default new CategoryModel()