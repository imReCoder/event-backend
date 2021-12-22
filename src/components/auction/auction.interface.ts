// import { Interface } from "readline";

export interface IAuction {
    title: string;
    startTime: Date;
    endTime: Date;

    startingBid: number;

    currentBid: Bid;

    creator: string;
    auctionEventId: string;
    previousBid:Bid[]

}

interface Bid{
    user:string,
    amount:number
}