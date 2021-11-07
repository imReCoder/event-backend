// import { Interface } from "readline";

export interface IEvent {
    title: string;
    amount: string;
    startDate: Date;
    endDate: Date;
    type: string;
    creator: string,
    eventPortfolio: string;
    information: string;
    gallery: Array<string>;
    venue: string;
    organizer: number;
    createdAt:Date;
    updatedAt: Date;
}