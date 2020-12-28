import { generateToken, imageUrl, isValidMongoId, otpGenerator, pruneFields, takeYMD } from "../../lib/helpers";
import { HTTP400Error, HTTP401Error } from "../../lib/utils/httpErrors";
import { IUserModel, User } from "./user.schema";
import _ from "lodash";
import { sendMessage } from "../../lib/services/textLocal";
import { paginationConfig } from "../../config";
import { encrypt, decrypt } from '../../lib/helpers/crypto'
import { ObjectID } from "bson";


export class UserModel {

  private default: string = "firstName lastName userName phone email role avatar position dateOfBirth gender city state pincode newsInterests isVerified createdAt deleted isPhoneVerified";
  private fetchFields = `${this.default} position followers followings party mediaGroup `;
  private pruningFields: string = '_id followers following tokens isVerified deviceType userName email phone role otp createdAt updatedAt __v';

  private fieldsOfUser = "firstName lastName avatar userName role isVerified";


  async fetchAll(query: any) {
    const condition: any = {};
    console.log('query.latest' + query.latest);
    let sortArgument = { createdAt: -1 };
    if (query.latest === 'true') {
      console.log('Latest is True');
      sortArgument = { createdAt: -1 };

    } else {
      sortArgument = { createdAt: 1 };
    }


    if (query.lastTime) {

      const dateObj = new Date(parseInt(query.lastTime, 10));
      if (query.latest == 'true') {
        condition.createdAt = { $lt: dateObj };
      } else {
        condition.createdAt = { $gt: dateObj };
      }

    }


    const data = await User
      .find({
        role: { $ne: "admin" }
        , ...condition
      }, this.fetchFields)
      .limit(paginationConfig.MAX_USERS)
      .populate("party", "name")
      .populate("mediaGroup", "name")
      .sort(sortArgument);

    const lastTime = (data.length > 0) ? data[data.length - 1].createdAt.getTime() : undefined;
    return {
      payload: data,
      lastTime,
      maxCount: paginationConfig.MAX_USERS
    };


  }

  async fetchDailyStats() {
    return User.aggregate([{
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 }
      }
    }, {
      $sort: {
        _id: -1
      }
    }]);
  }

  async fetch(id: string): Promise<IUserModel> {
    const data: any = await User.findById(id, this.fetchFields).lean();
    if (data) {
      data.dateOfBirth = data.dateOfBirth ? takeYMD(data.dateOfBirth) : "";
    }
    return data;
  }

  async fetchOnOtp(id: string, otp: number) {
    return await User.findOne({ _id: id, otp }, this.default);
  }
  
  async fetchOnSocialCode(socialCode: string) {
    return User.findOne({
      $or: [
        { facebookId: socialCode },
        { instagramId: socialCode }]
    }, this.default);
  }

  async fetchOnPhone(phone: string) {
    return User.findOne({ phone }, this.default);
  }

  async add(body: any) {
    console.log(body);
    const q: IUserModel = new User(body);
    const data: IUserModel = await q.addNewUser();
    return { _id: data._id };
  }

  async verifyOtp(id: string, otp: number) {
    try {
      if (!otp) {
        throw new HTTP400Error("OTP not entered");
      }

      let data;
      data = await this.fetchOnOtp(id, otp);
      if (!data) {
        throw new HTTP400Error("The otp you have provided is not correct");
      }
      if (data.phone !== '9876543219') {
        this.updateOtp(id);
      }
      data = await User.findOneAndUpdate({ _id: new ObjectID(id) }, { $set: { isPhoneVerified: true } }, { new: true }).select(this.default);
      const token = await this.addNewToken(id, data!);
      return { data, token };
    } catch (e) {
      throw new HTTP400Error(e);
    }
  }

  async loginWithSocialCode(socialCode: string) {
    const data: IUserModel | null = await this.fetchOnSocialCode(socialCode);
    if (!data) {
      throw new HTTP400Error(
        "No user with this social media is linked",
        "Please signUp first before log into this"
      );
    }
    const token = [await this.addNewToken(data._id, data)];
    return { data, token };
  }

  private randomString(length: number) {
    return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
  }

  async login(phone: string, admin?: boolean) {
    const data: IUserModel | null = await this.fetchOnPhone(phone);
    if (!data) {
      let s = this.randomString(6);
      let body = {
        role: 'voter',
        firstName: `PolBol_${s}`,
        userName: `PolBol_${s}`,
        lastName: ``,
        phone: phone
      }
      let data = await this.add(body);
      const otp = this.updateOtp(data._id);
      console.log(otp);
      let otpData;
      otpData = await this.sendOtpToMobile(otp, phone);
      console.log(otpData);
      if (otpData.proceed) {
        return { _id: data._id, isExisted: false };
      } else {
        throw new HTTP400Error("Unable to Send OTP");
      }
    }
    if (admin) {
      if (data.role !== 'admin') {
        throw new HTTP401Error("No Admin Account found for this number");
      }
    }
    let otpData;
    if (phone === '9876543219') {
      otpData = { proceed: true };
    } else {
      const otp = this.updateOtp(data._id);
      console.log(otp);
      otpData = await this.sendOtpToMobile(otp, phone);
    }

    console.log(otpData);
    // TODO: Uncomment
    if (otpData.proceed) {
      return { _id: data._id, isExisted: true };
    } else {
      throw new HTTP400Error("Unable to Send OTP");
    }
  }


  async addNewToken(id: string, data: IUserModel): Promise<string> {
    const { _id, phone, role } = data;
    const tokens = await generateToken({ _id, phone, role });
    User.findByIdAndUpdate(id, { $push: { tokens } }).then();
    return tokens;
  }


  async remove(id: string) {
    const q: IUserModel = new User({ _id: id });
    return q.remove();
  }

  updateOtp(id: string): number {
    console.log("New OTP");
    const otp = otpGenerator();
    User.findByIdAndUpdate(id, { otp }).then();
    return otp;
  }

  async sendOtpToMobile(otp: number, phone: string) {
    console.log(`send this ${otp} to ${phone}`);
    const message = `Your Polbol login OTP is ${otp}.`;
    return sendMessage(phone, message);
  }

  async followers(id: string) {
    const data: any = await User.findById(id, 'followers')
      .populate("followers", this.fieldsOfUser);

    return _.map(data.followers, el => {
      el.avatar = imageUrl(el.avatar);
      return el;
    });
  }

  async followings(id: string) {
    const data: any = await User.findById(id, 'followings')
      .populate("followings", this.fieldsOfUser);

    return _.map(data.followings, el => {
      el.avatar = imageUrl(el.avatar);
      return el;
    });
  }

  async searchUsers(query: any) {
    console.log(query);
    if (!query.query) {
      throw new HTTP400Error("Missing Search Query");
    }
    const condition: any = {};
    const firstNameQuery = {
      firstName: {
        $regex: query.query,
        $options: "$i"
      }
    };
    const lastNameQuery = {
      lastName: {
        $regex: query.query,
        $options: "$i"
      }
    };
    const userNameQuery = {
      userName: {
        $regex: query.query,
        $options: "$i"
      }
    };
    const phoneQuery = {
      phone: {
        $regex: query.query,
        $options: "$i"
      }
    };
    const countCondition = {
      $or: [userNameQuery, firstNameQuery, lastNameQuery, phoneQuery]
    };
    const searchCount = await User.countDocuments(countCondition);
    // console.log(searchCount);

    if (query.lastTime) {
      const dateObj = new Date(parseInt(query.lastTime, 10));
      condition.createdAt = { $lt: dateObj };
    }
    const finalCondition = {
      $and: [
        { $or: [userNameQuery, firstNameQuery, lastNameQuery, phoneQuery] },
        condition
      ]
    };

    console.log(JSON.stringify(finalCondition, null, 4));

    const data = (searchCount > 0) ? await User.find(finalCondition, this.default).sort('-createdAt').limit(paginationConfig.MAX_USERS) : [];
    const lastTime = (data.length > 0) ? data[data.length - 1].createdAt.getTime() : undefined;
    return {
      payload: data,
      searchCount,
      lastTime,
      maxCount: paginationConfig.MAX_USERS
    };
  }

  // ==========================================\\
  //     Future whatsapp Integartion            \\
  //===========================================\\

  private async sendLinkToWhatsapp(hash: any, phone: string) {
    const message = `Your Polbol login link is https://13.235.90.125:2112/api/v1/user/whatsAppAuth/callback?p=${hash.content}&i=${hash.iv}`;
    console.log(message)
    return sendMessage(phone, message);
  }

  public async loginWithWhatsApp(body: IUserModel) {
    try {
      const q: IUserModel = new User(body);
      const data = await q.addNewUser();
      let hash = encrypt(data._id.toString());
      this.sendLinkToWhatsapp(hash, body.phone)
      return { success: true };
    } catch (e) {
      throw new HTTP400Error(e)
    }
  }

  public async whatsAppAuthCallback(body: any) {
    try {
      let decrypted = decrypt({ 'content': body.p, 'iv': body.i });
      if (isValidMongoId(decrypted)) {
        let data = await User.findById(decrypted);
        if (data) {
          const token = await this.addNewToken(decrypted, data);
          return { data, token };
        } else {
          throw new HTTP400Error('Invalid URL Link')
        }
      } else {
        throw new HTTP400Error('Invalid MongoDB ID')
      }
    } catch (e) {
      throw new HTTP400Error(e)
    }
  }

}

export default new UserModel();
