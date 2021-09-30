// you can move this interface at any common place
// for now I wil stick with in components flow.
export interface IUser {
  phone: string;
  tokens: string[];
  role: string;
  otp: number;
  isPhoneVerified: boolean,
  createdAt:Date,
  firstName:string,
  lastName:string,
  userName:string,
  
  email:string
}
