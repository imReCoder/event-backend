import { Document, Model, model, Schema } from "mongoose";
import { NextFunction } from "express";
import { IUser } from "./user.interface";
import bcrypt from 'bcrypt'

export interface IUserModel extends IUser,Document {
  addNewUser(): IUserModel;
  correctPassword(pass1:string,pass2:string):boolean;
}

export const UserSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      minlength: 2,
      required: true
    },
    lastName: {
      type: String,
      minlength: 2,
      required: true
    },
    username: {
      type: String,
      unique:true
      //required: true,
    },
    password: {
      type: String,
      select: false,
      unique:true
    },
    email: {
      type: String,
      minlength: 3,
    },
    dateOfBirth: Date,
    role: {
      type: String,
      enum: ["user", "admin"],
      required: true
    },
    facebookId: {
      type:String
    },
  },
  {
    timestamps: true
  }
);

UserSchema.methods.addNewUser = async function () {
    return this.save();
}


UserSchema.methods.correctPassword = async function (candidatePassword:string, userPassword:string) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

export const User: Model<IUserModel> = model<IUserModel>("User", UserSchema);