import { transactionStatus } from './../transactions/transaction.interface';
import {generateToken, imageUrl, isValidMongoId, otpGenerator} from "../../lib/helpers";
import { User, UserSchema } from "./user.schema";
import { IUser } from './user.interface';
import { IUserModel } from "./user.schema";
import socialAuth from "./../../lib/middleware/socialAuth";
import bcrypt from 'bcrypt';
import axios from 'axios';
import { sendMessage } from "./../../lib/services/textlocal";
import jwt from 'jsonwebtoken';
import { ObjectID } from "bson";
import { commonConfig } from "../../config";
import { HTTP400Error, HTTP401Error, HTTPClientError } from "../../lib/utils/httpErrors";
import HttpException from "../..//exceptions/HttpException";
import transactionModel from '../transactions/transaction.model';

export class UserModel {
    public async fetchAll() {
        
        const data = User.find();

        return data;
    }

    public async  fetch(id:string) {
      const data = User.findById(id);
      return data;
    }

    public async update(id:string, body:IUserModel) {
        const data = await User.findByIdAndUpdate(id, body, {
            runValidators:true,
            new:true
        })

        return data;
    }

  public async delete(id: string) {
    await User.deleteOne({ _id: id });
  }

  async add(body: any) {
    console.log('User Info While Adding new User', body);
    if (body.password) {
      body.password = await bcrypt.hash(body.password, 12);
    }
    const q: IUserModel = new User(body);
    const data: IUserModel = await q.addNewUser();
    return { _id: data._id };
  }

  

  public async signUp(body: IUserModel) {
    try {
      await this.isUserExist(body);
      // const user = await User.findOne({ phone: body.phone });
        body.role = 'user';
        let data = await this.add(body);
        const otp = this.updateOtp(data._id);
        console.log(otp);
        let otpData;
        otpData = await this.sendOtpToMobile(otp, body.phone);
        console.log(otpData);
        if (otpData.proceed) {
          return { _id: data._id, isExisted: false };
        } else {
          throw new HTTP400Error("Unable to Send OTP");
        }
      
      const userData = await this.addNewToken(data._id);

      return userData;

      }catch(e){
      throw new HTTP400Error(e.message);
      }
            
  };

  public async loginWithPhone(body:any){
    console.log("login with phone request");
    let existingUser:IUserModel = await this.isPhoneExist(body);
    let newUser;
    let userExisted = true;
    if(!existingUser){
      body.role = 'user';
      body.isVerified = true;
      newUser = await this.add(body);
      userExisted = false;
    }
    const otpData = userExisted?await this.generateOTP(existingUser,body):await this.generateOTP(newUser,body);
    if (otpData.proceed) {
      if(userExisted){
        return { _id: existingUser._id,isExisted:true };
      }
      return {_id:newUser._id,isExisted:false};

    } else {
      throw new HTTP400Error("Unable to Send OTP");
    }
    return 
  }
  
  public async generateOTP(user:any,body:any){
    const otp = this.updateOtp(user._id);
    console.log(otp);
    let otpData;
    otpData = await this.sendOtpToMobile(otp, body.phone);
    return otpData;
  }
  
  public async isUserExist(body: any) {
    try {
      const { username, password } = body;

      // 1>  check email and password exist
      if (!username || !password) {
        throw new HTTP400Error('Please provide username or password');
      }
      // 2> check if user exist and password is correct
      const user = await User.findOne({ username: username }).select('+password');

      if (user) {
        throw new HTTP400Error('Invalid username or password');
      }
    } catch (e) {
      throw new HTTP400Error(e.message);
    }
  }


  public async isPhoneExist(body: any) {
    try {
      const { phone } = body;

      // 1>  check email and password exist
      if (!phone) {
        throw new HTTP400Error('Please provide phone number');
      }
      // 2> check if user exist and password is correct
      const user = await User.findOne({ phone: phone });

      if (user) {
        return user
      }
      return null
    } catch (e) {
      throw new HTTP400Error(e.message);
    }
  }
  public async login(body: any) {
    try {
      const { username, password } = body;

      // 1>  check email and password exist
      if (!username || !password) {
        throw new HTTP400Error('Please provide username or password');
      }
      // 2> check if user exist and password is correct
      const user = await User.findOne({ username: username }).select('+password');

      if (!user || !(await user.correctPassword(password, user.password))) {
        throw new HTTP400Error('Invalid email or password');
      }
      // 3> if eveything is ohkay send the token back
      const userData = await this.addNewToken(user._id);
  
      return userData;
    } catch (e) {
      throw new HTTP400Error(e.message);
    }
};

    public async authenticateWithAccesToken(data: any) {
      try {
          //, { appleSub: data.id }
        console.log(data);
          let userInfo = await User.findOne({ $or: [{$and:[{email:{$ne:null}},{email:{$eq:data.email}}]},{ $and:[{facebookId:{$ne:null}},{facebookId:{$eq:data.id}}] }] });
            console.log('User At Social Auth :', userInfo);
            if (userInfo) {
            console.log(userInfo);
              console.log(userInfo,"User info here");
                // let token = await this.addNewToken(userInfo._id, userInfo);
                return { userInfo, isExisted: true };
            }
            else {
                return { data, isExisted: false };
            }
        } catch (e) {
            throw new HTTP400Error(e);
        }
    }


    public async loginViaSocialAccessToken(body: any) {
    try {
      let user;
      if (body.authProvider === 'google') {
        user = await socialAuth.getGoogleUserInfo(body.access_token);
      } else if (body.authProvider === 'facebook') {
        user = await socialAuth.getFacebookUserInfo(body.access_token);
      } else if (body.authProvider === 'apple') {
        // user = await socialAuth.verifyAppleUserInfo(body);
      }
      console.log('Login Info as Fetched By Auth Provider : ', user)
      let response = await this.authenticateWithAccesToken(user);

      if (!response.isExisted) {
        let u;
        let userName = await this.generateValidUsername(user.given_name);
        if (body.authProvider === 'facebook') {
          u = {
            role: 'user',
            firstName: `${user.given_name}`,
            username: userName,
            lastName: `${user.family_name}`,
            phone: body.phone,
            facebookId: user.id
          }
        } else if (body.authProvider === 'google') {
          console.log(user);
          u = {
            role: 'user',
            firstName: `${user.given_name}`,
            username: userName,
            lastName: `${user.family_name}`,
            phone: body.phone,
            email: user.email,
          }
        }

        const data = await this.add(u);
        const userData = await this.addNewToken(data._id);
        return userData;
      } else {
        const userData = await this.addNewToken(response.userInfo._id);
        return userData;
      }
    } catch (e) {
      throw new HTTP400Error(e.message);
    }
  }

  public async addFollower(id: string, userId: string) {
    
    const data = User.findOneAndUpdate({ id: userId }, {
        $push:{ "followers":id }
    })

    return data;
  };
  
  public async fetchWalletTransaction(userId: string,status:transactionStatus) {
    try {
      const apiKey = process.env.IKCPLAYAPIKEY;
      const url = process.env.IKC_MASTER_WALLET_URI;
     console.log(userId);
      const user = await User.findById(userId);

      const phone = Number(user.phone);

      if (!user || !user.phone) {
        throw new HTTP400Error("User phone number is not added");
      }
      const transactions = await transactionModel.fetchTransactionsByUserId(userId,status);
      // const res = await axios({
      //   method: "GET",
      //   url: `${url}/wallet/fetchTrasactions?apiKey=${apiKey}&phone=${phone}`
      // });

      // console.log(res.data);
      // if (res && res.data.status) {
      //   return res.data.payload;
      // } else {
      //   throw new HTTP400Error("Error fetching Wallet Transactions");
      // }
      if(!transactions || !transactions.length) throw new HTTP400Error("No transactions");
      return transactions;
    } catch (e) {
      throw  new HTTP400Error(e.message);
    }
  }

  public async fetchWalletBalance(id:string) {
    try {
      const user = await User.findById(id);
      console.log(user);
      if (user.phone) {
        const apiKey = process.env.IKCPLAYAPIKEY;
        const url = process.env.IKC_MASTER_WALLET_URI;

        const wallet = await axios({
          method: 'GET',
          url: `${url}/wallet?apiKey=${apiKey}&phone=${user.phone}`,
        })
      
        if (wallet) {
          console.log(wallet);
          return wallet.data.payload.balance;
        } else {
          throw new HTTP400Error('Error fetching wallet balance');
        }
      } else {
        return 0;
      }
    } catch (e) {
      throw new HTTP400Error(e);
    }
  };

  public async addFollowing(id: string, userId: string) {
    const data = User.findOneAndUpdate({ _id: userId }, {
      $push:{"following":id}
    })

    return data;
  };


  public async addFollowRequest(id: string,userId:string) {
    const data = User.findOneAndUpdate({ id: userId }, {
      $push:{"followRequest":id}
    })

    return data;
  };

  public async acceptFollowRequest(id: string, userId: string) {
    const data = await User.findOneAndUpdate({ id: userId }, {
      $pull: { "followRequest": id }
    });

    if (data) {
      await User.findOneAndUpdate({ id: userId }, {
        $push:{"followRequest":id}
      })

      await User.findOneAndUpdate({ id }, {
        $push: { "following": userId }
      });
    }

    return data;
  };
  
  updateOtp(id: string): number {
    console.log("New OTP");
    const otp = otpGenerator();
    User.findByIdAndUpdate(id, { otp }).then();
    return otp;
  }

  async sendOtpToMobile(otp: number, phone: string) {
    console.log(`send this ${otp} to ${phone}`);
    const message = `Your Polbol login OTP is ${otp}.`;
    if(process.env.NODE_ENV == 'development') return {proceed:true};
    return sendMessage(phone, message);
  }


  
  // private async generateValidUsername(firstName: string, id: string | null = null) {
  //   let s = this.randomString(6);
  //   let userName = `${firstName}_${s}`
  //   if (id == null) {
  //     while ((await User.findOne({ "userName": userName }).count()) > 0) {
  //       s = this.randomString(6);
  //       userName = `${firstName}_${s}`
  //     }
  //   } else {
  //     while ((await User.findOne({ _id: { $ne: id }, "userName": userName }).count()) > 0) {
  //       s = this.randomString(6);
  //       userName = `${firstName}_${s}`
  //     }
  //   }
  //   return userName;
  // }

  public signToken = (id: string) => {
    return jwt.sign({ id }, commonConfig.jwtSecretKey, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  };

  
  public async addNewToken(id:string) {
    // const responseHandler = new ResponseHandler();
    const user = await User.findById(id);
    // let ikcbalance = await this.fetchWalletBalance(id);
    const token = this.signToken(id);
    // console.log(ikcbalance);
    // user.ikcbalance = ikcbalance;
    console.log(user);
    const data = {
      token,
      user
    };

    return data;
  }


  async fetchOnOtp(id: string, otp: number) {
    return await User.findOne({ _id: id, otp });
  }

  async verifyOtp(id: string, otp: number) {
    try {
      if (!otp) {
        throw new HTTP400Error("OTP not entered");
      }

      let data;
      data = await this.fetchOnOtp(id, otp);
      if (!data) {
         throw new HTTP400Error('The otp you have provided is not correct'); //Error("The otp you have provided is not correct");
      }
      if (data.phone !== '9876543219') {
        this.updateOtp(id);
      }
      data = await User.findOneAndUpdate({ _id: new ObjectID(id) }, { $set: { isVerified: true } }, { new: true });
      const token = await this.addNewToken(id);
      return { data, token };
    } catch (e) {
      throw new HTTP400Error(e.message);
    }
  }

  private async generateValidUsername(firstName: string, id: string | null = null) {
    let s = this.randomString(6);
    let userName = `${firstName}_${s}`
    if (id == null) {
      while ((await User.findOne({ "userName": userName }).count()) > 0) {
        s = this.randomString(6);
        userName = `${firstName}_${s}`
      }
    } else {
      while ((await User.findOne({ _id: { $ne: id }, "userName": userName }).count()) > 0) {
        s = this.randomString(6);
        userName = `${firstName}_${s}`
      }
    }
    return userName;
  }

  private randomString(length: number) {
    return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
  }

  public async addPhone(body: any) {
    try {
      let user;
      if (body.authProvider === 'google') {
        user = await socialAuth.getGoogleUserInfo(body.access_token);
      } else if (body.authProvider === 'facebook') {
        user = await socialAuth.getFacebookUserInfo(body.access_token);
      } 
      console.log('User At Addding Phone In Social Auth:', user);
      if (user) {
        let temp = await User.findOne({ $or: [{ $and: [{ email: { $ne: null } }, { email: { $eq: user.email } }] }, { $and: [{ facebookId: { $ne: null } }, { facebookId: { $eq: user.id } }] }] }); //If User exist but starting facebook auth
        let updatePhone = await User.findOne({ $or: [{ facebookId: user.id }, { appleSub: user.id }] }); // If user added facebookId but while adding phone number entred worng number and an OTP is sent
        if (temp) {
          // if (body.authProvider === 'facebook') {
          //   await User.updateOne({ phone: body.phone }, { $set: { facebookId: user.id } });
          // } 
          // let otpData;
          // if (body.phone === '9876543219') {
          //   otpData = { proceed: true };
          // } else {
          //   const otp = this.updateOtp(temp._id);
          //   console.log(otp);
          //   otpData = await this.sendOtpToMobile(otp, body.phone);
          //   console.log(otpData);
          // }
          // TODO: Uncomment
          const token = this.addNewToken(temp._id);
          if (temp) {
            return { _id: temp._id, isExisted: true,token };
          } else {
            throw new HTTP400Error("Unable to Send OTP");
          }
        } else if (updatePhone) {
          let data = await User.findOneAndUpdate({ $or: [{ facebookId: user.id }, { appleSub: user.id }] }, { $set: { phone: body.phone } });
          if (data) {
            const otp = this.updateOtp(data._id);
            console.log(otp);
            let otpData;
            otpData = await this.sendOtpToMobile(otp, body.phone);
            console.log(otpData);
            if (otpData.proceed) {
              return { _id: data._id, isExisted: false };
            } else {
              throw new HTTP400Error("Unable to Send OTP");
            }
          } else {
            throw new HTTP400Error('Error in Facebook User for Updatiing Phone');
          }
        } else { // If we are adding a completely new user
          let u;
          let userName = await this.generateValidUsername(user.given_name);
          if (body.authProvider === 'facebook') {
            u = {
              role: 'user',
              firstName: `${user.given_name}`,
              username: userName,
              lastName: `${user.family_name}`,
              phone: body.phone,
              facebookId: user.id
            }
          } else if (body.authProvider === 'google') {
            console.log(user);
            u = {
              role: 'user',
              firstName: `${user.given_name}`,
              username: userName,
              lastName: `${user.family_name}`,
              phone: body.phone,
              email: user.email,
            }
          }

          let data = await this.add(u);
          const otp = this.updateOtp(data._id);
          console.log(otp);
          let otpData;
          otpData = await this.sendOtpToMobile(otp, body.phone);
          console.log(otpData);
          if (otpData.proceed) {
            return { _id: data._id, isExisted: false };
          } else {
            throw new HTTP400Error("Unable to Send OTP");
          }
        }
      } else {
        throw new HTTP400Error('Not Authorised to edit phone number');
      }
    } catch (e) {
      console.log(e);
      throw new HTTP400Error(e);
    }
  }

  public async genrateOTP(phone: string) {
    const otp = otpGenerator();

    const res = await this.sendOtpToMobile(otp, phone,);
    

    if (res.proceed) {
      return { res, proceed: true };
    }

    return { proceed: false };
  };

  public async addPhoneNumber(id: string, phone: string) {
    try {
      console.log(id);
      const user = await User.findById(id);
      console.log(user);

      if (!user) {
        throw new HTTP400Error("User does not exist");
      }

      if (user.phone == null) {
        await User.findOneAndUpdate({ _id: id }, {
          $set: { phone: phone }
        });
      }

      const otp = await this.updateOtp(id);

      let otpData;
      otpData = await this.sendOtpToMobile(otp, phone);
      console.log(otpData);
      if (otpData.proceed) {
        return { _id: user._id, isExisted: true };
      } else {
        throw new HTTP400Error("Unable to Send OTP");
      }
    }catch(e){
      throw new HTTP400Error(e.message);
    }
    
  }

  public async isUserVerified(id: string) {
    const user = await User.findById(id);

    if (user.isVerified) {
      return { proceed: true,phone:user.phone };
    }

    return { proceed: false };
  };

  public async addIcon(id: string, filelocation: string) {
    try {
      console.log(id);
      const data = await User.findOneAndUpdate({ _id: id }, {
         "image": filelocation
             },
        { new: true });
      
      return data;
    } catch (e) {
      throw new HTTP400Error(e.message);
    }
  };
}

export default new UserModel();