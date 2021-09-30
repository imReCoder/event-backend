// import { Interface } from "readline";

export interface IUser {
    firstName: string;
    lastName: string;
    userName: string;
    password: string;
    email: string;
    role: string;
    dateOfBirth: Date;
    followers: Array<string>;
    following: Array<string>;
}