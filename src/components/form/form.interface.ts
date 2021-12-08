// import { Interface } from "readline";

export interface IForm {
    creator: string;
    title: string;
    eventId: string;
    
    description: string;

    questions: Question[];

}

interface Question{
    questionText:string,
    isRequired:boolean,
    forAllTickets:boolean,
    selectedTickets:string[],
    questionType:QuestionTypes[]
}
enum QuestionTypes{
    MCQ,
    DROPDOWN,
    TEXT_INPUT,
    PARAGRAPH,
    RADIO_BUTTON

}