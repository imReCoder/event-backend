// import { Interface } from "readline";

export interface IForm {
    creator: string;
    title: string;
    eventId: string;
    
    description: string;

    questions: Array<object>;

}