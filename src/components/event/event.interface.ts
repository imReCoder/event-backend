// import { Interface } from "readline";

export interface IEvent {
    name: string;
    displayName:string,
    visibility: EventVisibility;
    startDate: Date;
    endDate: Date;
    startTime:string,
    endTime:string,
    location:EventLocation,
    images:EventImages,
    description:string,
    repeating:boolean,
    repeatingPeriod:string,
    repeatingExceptionDays:Date[],
    containsTimeSlots:boolean,
    timeSlots:EventTimeSlots,
    ticketId:string,
    creator:string,
    createdAt:Date;
    updatedAt: Date;
    tickets:String[]
}

enum EventVisibility{
    PRIVATE,
    PUBLIC
}
interface EventLocation{
    venue:string,
    fullAddress:string
}
interface EventImages{
    desktopImage:string,
    mobileImage:string
}
interface EventTimeSlots{
    from:string,
    to:string
}