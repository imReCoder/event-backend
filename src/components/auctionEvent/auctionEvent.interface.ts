// import { Interface } from "readline";

export interface IAuctionEvent {
    title: string;

    auctionItems: Array<object>;
    creator: string;

    startTime: number;
    endTime: number;
    
    type: string;

    coverImage: string;
    icon: string;

}