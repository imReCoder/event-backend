// import { Interface } from "readline";

export interface IAuctionEvent {
    title: string;

    auctionItems: Array<object>;
    creator: string;

    startDate: Date;
    endDate: Date;
    
    type: string;

    coverImage: string;
    icon: string;

}