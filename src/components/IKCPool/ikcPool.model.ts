import Axios from 'axios'
import { HTTP400Error } from "../../lib/utils/httpErrors";

export class ikcPool {
    public async deductIKC(userId: string, cost: number) {
        try{
            let {data}= await Axios.get('http');
            if(data.success){
                return {proceed:true};
            }else{
                return {proceed:false}
            }
        }catch(e){
            console.log(e);
            throw new HTTP400Error(e);
        }
    }
}

export default new ikcPool()