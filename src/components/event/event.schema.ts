import { Document, Model, model, Schema } from "mongoose";
import { NextFunction } from "express";
import { IEvent } from "./event.interface";
import bcrypt from 'bcrypt'

export interface IEventModel extends IEvent, Document {
    addNewEvent(): any;
}
const LocationSchema =new Schema({
    venu:{type:String},
    fullAddress:{type:String}
});
const EventImageSchema = new Schema({
    desktopImage:{
        type:String
    },
    mobileImage:{
        type:String
    }
});
export const EventSchema: Schema = new Schema(
    {
        name: {
            type: String,
            minlength: 2,
            required: true
        },
        displayName: {
            type: String,
            required: true
        },
        visibility: {
            type: String,
            enum:["PRIVATE","PUBLIC"],
            description:"visibility must be PUBLIC or PRIVATE"
        },
        
        startDate: {
            type: Date,
            required:true
        },
        endDate: {
            type: Date,
            required:true
        },
        location: {
            type:LocationSchema
        },
        images:{
            type:EventImageSchema
        },
        //new fields
        timeZone:{
            type:String
        },
        repeatingEvent:{
            type:Boolean
        },
        repeatingPeriod:{
            type:String
        },
        repeatingExceptionDays:{
            type:Array
        },
        containsTimeSlots:{
            type:Boolean
        },
        timeSlots:{
            trk:[{
                from:String,
                to:String
            }]
        },
      
        type: {
            type: String,
            enum: ["ONLINE", "PHYSICAL","VIRTUAL"],
            required: true,
            description:"type must be ONLINE,PHYSICAL,VIRTUAL"
        },
        likes: {
            type: Number,
            default:0
        },
        shares: {
            type: Number,
            default:0
        },
        isFreebie: {
            type: Boolean,
        },
        creator: {
            type: String,
            ref:"User"
        },
        tickets:[{
            type:Schema.Types.ObjectId,
            ref:"Tickets"
        }]

    },
    {
        timestamps: true
    }
);

EventSchema.methods.addNewEvent = async function () {
    return this.save();
}


export const Event: Model<IEventModel> = model<IEventModel>("Event", EventSchema);