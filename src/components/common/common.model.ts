import { HTTP400Error } from './../../lib/utils/httpErrors';
import { AuctionEvent } from './../auctionEvent/auctionEvent.schema';
import { Auction } from './../auction/auction.schema';
export class CommonModel{
    public async search(key:string){
        console.log("key is ",key);
        let auctionEvents = await AuctionEvent.find({ title: { $regex: key, $options: "i" }});
        let auctions = await Auction.find({ title: { $regex: key, $options: "i" }});
        
        const data = {
            auctionItems:auctions,
            auctionEvents:auctionEvents
        }
        
        return data;
       }
}

export default new CommonModel();