
export interface ITicket{
    name:string,
    type:TicketType,
    totalQuantity:Number,
    ticketPrice:Number,
    startDate:Date,
    startTime:string,
    endDate:Date,
    endTime:string,
    minimumPerBooking:Number,
    maximumPerBooking:Number,
    GSTInvoice:boolean,
    GSTNumber:string,
    townScriptFeePayer:string,
    paymentGatewayFeePayer:FEEPAYER,
    ticketDescription:string
    msgToAttendee:string,
    currency:string,
    creator:string,
    eventId:string
}

enum TicketType{
    PAID,
    FREE,
    DONATION
}
enum FEEPAYER{
    ME,
    BUYER
}