"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const helpers_1 = require("../../lib/helpers");
const user_schema_1 = require("./user.schema");
const socialAuth_1 = __importDefault(require("./../../lib/middleware/socialAuth"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const axios_1 = __importDefault(require("axios"));
const textlocal_1 = require("./../../lib/services/textlocal");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bson_1 = require("bson");
const config_1 = require("../../config");
const httpErrors_1 = require("../../lib/utils/httpErrors");
const transaction_model_1 = __importDefault(require("../transactions/transaction.model"));
class UserModel {
    constructor() {
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
        this.signToken = (id) => {
            return jsonwebtoken_1.default.sign({ id }, config_1.commonConfig.jwtSecretKey, {
                expiresIn: process.env.JWT_EXPIRES_IN,
            });
        };
    }
    fetchAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = user_schema_1.User.find();
            return data;
        });
    }
    fetch(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = user_schema_1.User.findById(id);
            return data;
        });
    }
    update(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield user_schema_1.User.findByIdAndUpdate(id, body, {
                runValidators: true,
                new: true
            });
            return data;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield user_schema_1.User.deleteOne({ _id: id });
        });
    }
    add(body) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('User Info While Adding new User', body);
            if (body.password) {
                body.password = yield bcrypt_1.default.hash(body.password, 12);
            }
            const q = new user_schema_1.User(body);
            const data = yield q.addNewUser();
            return { _id: data._id };
        });
    }
    signUp(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.isUserExist(body);
                // const user = await User.findOne({ phone: body.phone });
                body.role = 'user';
                let data = yield this.add(body);
                const otp = this.updateOtp(data._id);
                console.log(otp);
                let otpData;
                otpData = yield this.sendOtpToMobile(otp, body.phone);
                console.log(otpData);
                if (otpData.proceed) {
                    return { _id: data._id, isExisted: false };
                }
                else {
                    throw new httpErrors_1.HTTP400Error("Unable to Send OTP");
                }
                const userData = yield this.addNewToken(data._id);
                return userData;
            }
            catch (e) {
                throw new httpErrors_1.HTTP400Error(e.message);
            }
        });
    }
    ;
    loginWithPhone(body) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("login with phone request");
            let existingUser = yield this.isPhoneExist(body);
            let newUser;
            let userExisted = true;
            if (!existingUser) {
                body.role = 'user';
                body.isVerified = true;
                newUser = yield this.add(body);
                userExisted = false;
            }
            const otpData = userExisted ? yield this.generateOTP(existingUser, body) : yield this.generateOTP(newUser, body);
            if (otpData.proceed) {
                if (userExisted) {
                    return { _id: existingUser._id, isExisted: true };
                }
                return { _id: newUser._id, isExisted: false };
            }
            else {
                throw new httpErrors_1.HTTP400Error("Unable to Send OTP");
            }
            return;
        });
    }
    generateOTP(user, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const otp = this.updateOtp(user._id);
            console.log(otp);
            let otpData;
            otpData = yield this.sendOtpToMobile(otp, body.phone);
            return otpData;
        });
    }
    isUserExist(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, password } = body;
                // 1>  check email and password exist
                if (!username || !password) {
                    throw new httpErrors_1.HTTP400Error('Please provide username or password');
                }
                // 2> check if user exist and password is correct
                const user = yield user_schema_1.User.findOne({ username: username }).select('+password');
                if (user) {
                    throw new httpErrors_1.HTTP400Error('Invalid username or password');
                }
            }
            catch (e) {
                throw new httpErrors_1.HTTP400Error(e.message);
            }
        });
    }
    isPhoneExist(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { phone } = body;
                // 1>  check email and password exist
                if (!phone) {
                    throw new httpErrors_1.HTTP400Error('Please provide phone number');
                }
                // 2> check if user exist and password is correct
                const user = yield user_schema_1.User.findOne({ phone: phone });
                if (user) {
                    return user;
                }
                return null;
            }
            catch (e) {
                throw new httpErrors_1.HTTP400Error(e.message);
            }
        });
    }
    login(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, password } = body;
                // 1>  check email and password exist
                if (!username || !password) {
                    throw new httpErrors_1.HTTP400Error('Please provide username or password');
                }
                // 2> check if user exist and password is correct
                const user = yield user_schema_1.User.findOne({ username: username }).select('+password');
                if (!user || !(yield user.correctPassword(password, user.password))) {
                    throw new httpErrors_1.HTTP400Error('Invalid email or password');
                }
                // 3> if eveything is ohkay send the token back
                const userData = yield this.addNewToken(user._id);
                return userData;
            }
            catch (e) {
                throw new httpErrors_1.HTTP400Error(e.message);
            }
        });
    }
    ;
    authenticateWithAccesToken(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //, { appleSub: data.id }
                console.log(data);
                let userInfo = yield user_schema_1.User.findOne({ $or: [{ $and: [{ email: { $ne: null } }, { email: { $eq: data.email } }] }, { $and: [{ facebookId: { $ne: null } }, { facebookId: { $eq: data.id } }] }] });
                console.log('User At Social Auth :', userInfo);
                if (userInfo) {
                    console.log(userInfo);
                    console.log(userInfo, "User info here");
                    // let token = await this.addNewToken(userInfo._id, userInfo);
                    return { userInfo, isExisted: true };
                }
                else {
                    return { data, isExisted: false };
                }
            }
            catch (e) {
                throw new httpErrors_1.HTTP400Error(e);
            }
        });
    }
    loginViaSocialAccessToken(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user;
                if (body.authProvider === 'google') {
                    user = yield socialAuth_1.default.getGoogleUserInfo(body.access_token);
                }
                else if (body.authProvider === 'facebook') {
                    user = yield socialAuth_1.default.getFacebookUserInfo(body.access_token);
                }
                else if (body.authProvider === 'apple') {
                    // user = await socialAuth.verifyAppleUserInfo(body);
                }
                console.log('Login Info as Fetched By Auth Provider : ', user);
                let response = yield this.authenticateWithAccesToken(user);
                if (!response.isExisted) {
                    let u;
                    let userName = yield this.generateValidUsername(user.given_name);
                    if (body.authProvider === 'facebook') {
                        u = {
                            role: 'user',
                            firstName: `${user.given_name}`,
                            username: userName,
                            lastName: `${user.family_name}`,
                            phone: body.phone,
                            facebookId: user.id
                        };
                    }
                    else if (body.authProvider === 'google') {
                        console.log(user);
                        u = {
                            role: 'user',
                            firstName: `${user.given_name}`,
                            username: userName,
                            lastName: `${user.family_name}`,
                            phone: body.phone,
                            email: user.email,
                        };
                    }
                    const data = yield this.add(u);
                    const userData = yield this.addNewToken(data._id);
                    return userData;
                }
                else {
                    const userData = yield this.addNewToken(response.userInfo._id);
                    return userData;
                }
            }
            catch (e) {
                throw new httpErrors_1.HTTP400Error(e.message);
            }
        });
    }
    addFollower(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = user_schema_1.User.findOneAndUpdate({ id: userId }, {
                $push: { "followers": id }
            });
            return data;
        });
    }
    ;
    fetchWalletTransaction(userId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const apiKey = process.env.IKCPLAYAPIKEY;
                const url = process.env.IKC_MASTER_WALLET_URI;
                console.log(userId);
                const user = yield user_schema_1.User.findById(userId);
                const phone = Number(user.phone);
                if (!user || !user.phone) {
                    throw new httpErrors_1.HTTP400Error("User phone number is not added");
                }
                const transactions = yield transaction_model_1.default.fetchTransactionsByUserId(userId, status);
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
                if (!transactions || !transactions.length)
                    throw new httpErrors_1.HTTP400Error("No transactions");
                return transactions;
            }
            catch (e) {
                throw new httpErrors_1.HTTP400Error(e.message);
            }
        });
    }
    fetchWalletBalance(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_schema_1.User.findById(id);
                console.log(user);
                if (user.phone) {
                    const apiKey = process.env.IKCPLAYAPIKEY;
                    const url = process.env.IKC_MASTER_WALLET_URI;
                    const wallet = yield (0, axios_1.default)({
                        method: 'GET',
                        url: `${url}/wallet?apiKey=${apiKey}&phone=${user.phone}`,
                    });
                    if (wallet) {
                        console.log(wallet);
                        return wallet.data.payload.balance;
                    }
                    else {
                        throw new httpErrors_1.HTTP400Error('Error fetching wallet balance');
                    }
                }
                else {
                    return 0;
                }
            }
            catch (e) {
                throw new httpErrors_1.HTTP400Error(e);
            }
        });
    }
    ;
    addFollowing(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = user_schema_1.User.findOneAndUpdate({ _id: userId }, {
                $push: { "following": id }
            });
            return data;
        });
    }
    ;
    addFollowRequest(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = user_schema_1.User.findOneAndUpdate({ id: userId }, {
                $push: { "followRequest": id }
            });
            return data;
        });
    }
    ;
    acceptFollowRequest(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield user_schema_1.User.findOneAndUpdate({ id: userId }, {
                $pull: { "followRequest": id }
            });
            if (data) {
                yield user_schema_1.User.findOneAndUpdate({ id: userId }, {
                    $push: { "followRequest": id }
                });
                yield user_schema_1.User.findOneAndUpdate({ id }, {
                    $push: { "following": userId }
                });
            }
            return data;
        });
    }
    ;
    updateOtp(id) {
        console.log("New OTP");
        const otp = (0, helpers_1.otpGenerator)();
        user_schema_1.User.findByIdAndUpdate(id, { otp }).then();
        return otp;
    }
    sendOtpToMobile(otp, phone) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`send this ${otp} to ${phone}`);
            const message = `Your Polbol login OTP is ${otp}.`;
            if (process.env.NODE_ENV == 'development')
                return { proceed: true };
            return (0, textlocal_1.sendMessage)(phone, message);
        });
    }
    addNewToken(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // const responseHandler = new ResponseHandler();
            const user = yield user_schema_1.User.findById(id);
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
        });
    }
    fetchOnOtp(id, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_schema_1.User.findOne({ _id: id, otp });
        });
    }
    verifyOtp(id, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!otp) {
                    throw new httpErrors_1.HTTP400Error("OTP not entered");
                }
                let data;
                data = yield this.fetchOnOtp(id, otp);
                if (!data) {
                    throw new httpErrors_1.HTTP400Error('The otp you have provided is not correct'); //Error("The otp you have provided is not correct");
                }
                if (data.phone !== '9876543219') {
                    this.updateOtp(id);
                }
                data = yield user_schema_1.User.findOneAndUpdate({ _id: new bson_1.ObjectID(id) }, { $set: { isVerified: true } }, { new: true });
                const token = yield this.addNewToken(id);
                return { data, token };
            }
            catch (e) {
                throw new httpErrors_1.HTTP400Error(e.message);
            }
        });
    }
    generateValidUsername(firstName, id = null) {
        return __awaiter(this, void 0, void 0, function* () {
            let s = this.randomString(6);
            let userName = `${firstName}_${s}`;
            if (id == null) {
                while ((yield user_schema_1.User.findOne({ "userName": userName }).count()) > 0) {
                    s = this.randomString(6);
                    userName = `${firstName}_${s}`;
                }
            }
            else {
                while ((yield user_schema_1.User.findOne({ _id: { $ne: id }, "userName": userName }).count()) > 0) {
                    s = this.randomString(6);
                    userName = `${firstName}_${s}`;
                }
            }
            return userName;
        });
    }
    randomString(length) {
        return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
    }
    addPhone(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user;
                if (body.authProvider === 'google') {
                    user = yield socialAuth_1.default.getGoogleUserInfo(body.access_token);
                }
                else if (body.authProvider === 'facebook') {
                    user = yield socialAuth_1.default.getFacebookUserInfo(body.access_token);
                }
                console.log('User At Addding Phone In Social Auth:', user);
                if (user) {
                    let temp = yield user_schema_1.User.findOne({ $or: [{ $and: [{ email: { $ne: null } }, { email: { $eq: user.email } }] }, { $and: [{ facebookId: { $ne: null } }, { facebookId: { $eq: user.id } }] }] }); //If User exist but starting facebook auth
                    let updatePhone = yield user_schema_1.User.findOne({ $or: [{ facebookId: user.id }, { appleSub: user.id }] }); // If user added facebookId but while adding phone number entred worng number and an OTP is sent
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
                            return { _id: temp._id, isExisted: true, token };
                        }
                        else {
                            throw new httpErrors_1.HTTP400Error("Unable to Send OTP");
                        }
                    }
                    else if (updatePhone) {
                        let data = yield user_schema_1.User.findOneAndUpdate({ $or: [{ facebookId: user.id }, { appleSub: user.id }] }, { $set: { phone: body.phone } });
                        if (data) {
                            const otp = this.updateOtp(data._id);
                            console.log(otp);
                            let otpData;
                            otpData = yield this.sendOtpToMobile(otp, body.phone);
                            console.log(otpData);
                            if (otpData.proceed) {
                                return { _id: data._id, isExisted: false };
                            }
                            else {
                                throw new httpErrors_1.HTTP400Error("Unable to Send OTP");
                            }
                        }
                        else {
                            throw new httpErrors_1.HTTP400Error('Error in Facebook User for Updatiing Phone');
                        }
                    }
                    else { // If we are adding a completely new user
                        let u;
                        let userName = yield this.generateValidUsername(user.given_name);
                        if (body.authProvider === 'facebook') {
                            u = {
                                role: 'user',
                                firstName: `${user.given_name}`,
                                username: userName,
                                lastName: `${user.family_name}`,
                                phone: body.phone,
                                facebookId: user.id
                            };
                        }
                        else if (body.authProvider === 'google') {
                            console.log(user);
                            u = {
                                role: 'user',
                                firstName: `${user.given_name}`,
                                username: userName,
                                lastName: `${user.family_name}`,
                                phone: body.phone,
                                email: user.email,
                            };
                        }
                        let data = yield this.add(u);
                        const otp = this.updateOtp(data._id);
                        console.log(otp);
                        let otpData;
                        otpData = yield this.sendOtpToMobile(otp, body.phone);
                        console.log(otpData);
                        if (otpData.proceed) {
                            return { _id: data._id, isExisted: false };
                        }
                        else {
                            throw new httpErrors_1.HTTP400Error("Unable to Send OTP");
                        }
                    }
                }
                else {
                    throw new httpErrors_1.HTTP400Error('Not Authorised to edit phone number');
                }
            }
            catch (e) {
                console.log(e);
                throw new httpErrors_1.HTTP400Error(e);
            }
        });
    }
    genrateOTP(phone) {
        return __awaiter(this, void 0, void 0, function* () {
            const otp = (0, helpers_1.otpGenerator)();
            const res = yield this.sendOtpToMobile(otp, phone);
            if (res.proceed) {
                return { res, proceed: true };
            }
            return { proceed: false };
        });
    }
    ;
    addPhoneNumber(id, phone) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(id);
                const user = yield user_schema_1.User.findById(id);
                console.log(user);
                if (!user) {
                    throw new httpErrors_1.HTTP400Error("User does not exist");
                }
                if (user.phone == null) {
                    yield user_schema_1.User.findOneAndUpdate({ _id: id }, {
                        $set: { phone: phone }
                    });
                }
                const otp = yield this.updateOtp(id);
                let otpData;
                otpData = yield this.sendOtpToMobile(otp, phone);
                console.log(otpData);
                if (otpData.proceed) {
                    return { _id: user._id, isExisted: true };
                }
                else {
                    throw new httpErrors_1.HTTP400Error("Unable to Send OTP");
                }
            }
            catch (e) {
                throw new httpErrors_1.HTTP400Error(e.message);
            }
        });
    }
    isUserVerified(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_schema_1.User.findById(id);
            if (user.isVerified) {
                return { proceed: true, phone: user.phone };
            }
            return { proceed: false };
        });
    }
    ;
    addIcon(id, filelocation) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(id);
                const data = yield user_schema_1.User.findOneAndUpdate({ _id: id }, {
                    "image": filelocation
                }, { new: true });
                return data;
            }
            catch (e) {
                throw new httpErrors_1.HTTP400Error(e.message);
            }
        });
    }
    ;
}
exports.UserModel = UserModel;
exports.default = new UserModel();
//# sourceMappingURL=user.model.js.map