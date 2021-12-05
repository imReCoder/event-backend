import { Document, Model, model, Schema, Types } from "mongoose";
import { NextFunction } from "express";
import { ITicket } from "./ticket.interface";
import bcrypt from "bcrypt";

export interface ITicketModel extends ITicket, Document {
  saveTicket(): any;
}

export const TicketSchema: Schema = new Schema(
  {
    name: {
      type: String,
      minlength: 2,
      required: true,
    },
 
    type: {
      type: String,
      enum:["PAID","FREE","DONATION"],
      required:false,
      default:"FREE"
    },
    totalQuantity: {
      type: Number,
      required:true,
      max:10000
    },
    ticketPrice:{
        type:Number,
        required:true,
        max:10000
    },
    startDate:{
        type:Date,
        required:true,
        maxlength:20
    },
    startTime:{
        type:String,
        required:true,
        maxlength:10
    },
    endDate:{
        type:Date,
        required:true,
        maxlength:20
    },
    endTime:{
        type:String,
        required:true,
        maxlength:10
    },
    minimumPerBooking:{
        type:Number,
        default:1,
        max:100
    },
    maximumPerBooking:{
        type:Number,
        required:true
    },
    GSTInvoice:{
        type:Boolean,
        required:true
    },
    GSTNumber:{
        type:String,
        maxlength:15,
        minlength:15,
        description:"GST must be of 15 characters"
    },
    creator:{
        type:String,
        ref:"User"
    },
    eventId:{
        type:String,
        required:true,
        ref:"Event"
    }
  },
  {
    timestamps: true,
  }
);

TicketSchema.methods.saveTicket = async function () {
  return this.save();
};

export const Ticket: Model<ITicketModel> =
  model<ITicketModel>("Ticket", TicketSchema);
