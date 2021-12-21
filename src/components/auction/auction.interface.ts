// import { Interface } from "readline";

export interface IAuction {
    title: string;
    startTime: Date;
    endTime: Date;

    startingBid: number;

    currentBid: any;

    creator: string;
    auctionEventId: string;

}