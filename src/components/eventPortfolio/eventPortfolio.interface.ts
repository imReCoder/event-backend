// import { Interface } from "readline";

export interface IEventPortfolio {
    title: string;
    coverImage: string;
    profileImage: string;
    eventsCount: number;
    followers: Array<string>;
    follow: Number;
    about: string;
    pastEvent: Array<Object>;
    upcomingEvent: Array<Object>;
    gallery: Array<string>;
}