"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../../config");
const sendMessage = (to, body) => {
    console.log(to, body, config_1.textLocalConfig.apiKey);
    return axios_1.default.get('https://api.textlocal.in/send/', {
        params: {
            apiKey: config_1.textLocalConfig.apiKey,
            sender: 'YBOXMD',
            numbers: '91' + to,
            message: body
        }
    }).then((response) => {
        const responseJson = response.data;
        console.log(responseJson);
        if (responseJson.status === 'success') {
            console.log(`Send OTP Success to ${to}`);
            return { proceed: true };
        }
        else {
            console.log("Error Sending OTP");
            console.log(responseJson);
            return { proceed: false };
        }
    }).catch(e => {
        console.log("Error Sending OTP");
        console.log(e);
        return { proceed: false };
    });
};
exports.sendMessage = sendMessage;
//# sourceMappingURL=textlocal.js.map