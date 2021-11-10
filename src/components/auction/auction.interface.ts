// import { Interface } from "readline";

export interface IAuction {
    title: string;
    startDate: Date;
    endDate: Date;

    startingBid: number;

    currentBid: any;

    creator: string;

}