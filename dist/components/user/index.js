"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const s3_1 = require("./../../lib/services/s3");
const user_controller_1 = __importDefault(require("./user.controller"));
exports.default = [
    {
        path: "/user",
        method: "get",
        handler: [user_controller_1.default.fetchAll]
    },
    {
        path: "/user",
        method: "post",
        handler: [user_controller_1.default.create]
    },
    {
        path: "/user/wallet",
        method: "get",
        handler: [user_controller_1.default.fetchWalletBalance]
    },
    {
        path: "/user/loggeduser",
        method: "get",
        handler: [user_controller_1.default.getLoggedUser]
    },
    {
        path: "/login",
        method: "post",
        escapeAuth: true,
        handler: [user_controller_1.default.logIn]
    },
    {
        path: "/login/phone",
        method: "post",
        escapeAuth: true,
        handler: [user_controller_1.default.loginWithPhone]
    },
    // {
    //   path: "/logout",
    //   method: "post",
    //   escapeAuth: true,
    //   handler: [userController.logIn]
    // },
    {
        path: "/signup",
        method: "post",
        escapeAuth: true,
        handler: [user_controller_1.default.signUp]
    },
    {
        path: "/follower/:id",
        method: "post",
        handler: [user_controller_1.default.addFollower]
    },
    {
        path: "/following/:id",
        method: "post",
        handler: [user_controller_1.default.addFollowing]
    },
    {
        path: "/followrequest/:id",
        method: "post",
        handler: [user_controller_1.default.addFolowRequest]
    },
    {
        path: "/auth",
        method: "post",
        escapeAuth: true,
        handler: [user_controller_1.default.loginViaSocialAccessToken]
    },
    {
        path: "/user/:id",
        method: "get",
        handler: [user_controller_1.default.fetch]
    },
    {
        path: "/user/:id",
        method: "patch",
        handler: [user_controller_1.default.update]
    },
    {
        path: "/user/addIcon",
        method: "post",
        handler: [s3_1.s3UploadMulter.single('file'), user_controller_1.default.uploadFile]
    },
    // {
    //   path: "/user/verifyUser",
    //   escapeAuth: true,
    //   method: "post",
    //   handler:[userController.verifyUser]
    // },
    // {
    //   path: "/user/addPhoneNumber",
    //   method: "post",
    //   handler:[userController.addPhoneNumber]
    // },
    {
        path: "/user/:id/verify-otp",
        method: "get",
        escapeAuth: true,
        handler: [user_controller_1.default.verifyOtp]
    },
    {
        path: "/user/generateOTP",
        escapeAuth: true,
        method: "post",
        handler: [user_controller_1.default.generateOTP]
    },
    {
        path: "/user/login/socialAuth/addphone",
        method: "get",
        escapeAuth: true,
        handler: [user_controller_1.default.socialAuthAddPhone]
    },
    //   {
    //     path: "/user/:id/photos",
    //     method: "get",
    //     handler: [userController.photos]
    //   }, {
    //     path: "/user/:id/liked",
    //     method: "get",
    //     handler: [userController.likes]
    //   }, {
    //     path: "/user/:id/follower",
    //     method: "get",
    //     handler: [userController.followers]
    //   },
    //   {
    //     path: "/user/:id/following",
    //     method: "get",
    //     handler: [userController.followings]
    //   },
    //   {
    //     path: "/user/is-available/userName",
    //     method: "get",
    //     escapeAuth: true,
    //     handler: [userController.isUsernameExist]
    //   },
    //   {
    //     path: "/user/search/on",
    //     method: "get",
    //     handler: [userController.searchByName]
    //   }
];
//# sourceMappingURL=index.js.map