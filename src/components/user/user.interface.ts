// import { Interface } from "readline";

export interface IUser {
    firstName: string;
    lastName: string;
    userName: string;
    password: string;
    email: string;
    role: string;
    phone: string;
    otp: number;
    isVerified: boolean;
    dateOfBirth: Date;
    followers: Array<string>;
    following: Array<string>;
}