import { Document, Model, model, Schema } from "mongoose";
import { IUser } from "./user.interface";
import { otpGenerator } from "../../lib/helpers";
import { HTTP409Error } from "../../lib/utils/httpErrors";

const ObjectID = Schema.Types.ObjectId;

export interface IUserModel extends IUser, Document {
  fullName(): string;
  addNewUser(): IUserModel;
  isEmailExist(): Promise<boolean>;
  phoneExist(phone: string): Promise<boolean>;
  userExist(phone: string): Promise<boolean>;
  findByPhone(phone: string): Promise<IUserModel>;
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
    },
    userName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      minlength: 3,
      required: true,
    },
    email: {
      type: String,
      minlength: 3,
    },
    avatar: {
      type: String,
      default: 'https://polbol-media.s3.ap-south-1.amazonaws.com/ic_user_dummy.jpg'
    },
    role: {
      type: String,
      enum: ["user","admin"],
      required: true
    },
    tokens: [String],
    otp: Number,
    followers: [{
      type: ObjectID,
      ref: "User"
    }],
    followings: [{
      type: ObjectID,
      ref: "User"
    }],
    isVerified: {
      type: Boolean,
      default: false
    },
    deleted: {
      type: Boolean,
      default: false
    },
    isPhoneVerified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

UserSchema.pre<IUserModel>("save", async function (next) {
  if (await this.userExist(this.phone)) {
    throw new HTTP409Error("User already exists. Please login.");
  }
  if (await this.phoneExist(this.phone)) {
    throw new HTTP409Error("Phone Number Already Registered.");
  }
  this.otp = otpGenerator();
  next();
});

UserSchema.methods.fullName = function (): string {
  return this.name.trim() + " " + this.age.trim();
};

UserSchema.methods.isEmailExist = async function (): Promise<boolean> {
  return 0 < (await User.findOne({ email: this.email }).countDocuments());
};

UserSchema.methods.addNewUser = async function () { //Create New Wallet 
  return await this.save();
};

// tslint:disable-next-line: only-arrow-functions
UserSchema.methods.phoneExist = async function (phone: string) {
  return (await User.findOne({ phone }).countDocuments()) > 0;
};
// tslint:disable-next-line: only-arrow-functions
UserSchema.methods.userExist = async function (phone: string) {
  return (await User.findOne({ $or: [{ phone }] }).countDocuments()) > 0;
};

UserSchema.statics.findByPhone = async (phone: string) => {
  return User.findOne({ phone }, "name userName phone");
};

export const User: Model<IUserModel> = model<IUserModel>("User", UserSchema);
