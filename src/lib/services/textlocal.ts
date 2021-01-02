import axios from 'axios';
import {textLocalConfig} from "../../config";

export const sendMessage = (to: string, body: string) => {
  return axios.get('https://api.textlocal.in/send/', {
    params: {
      apiKey: textLocalConfig.apiKey,
      sender: 'YBOXMD',
      numbers: '91' + to,
      message: body
    }
  }).then((response) => {
    const responseJson = response.data;
    console.log(responseJson);
    if (responseJson.status === 'success') {
      console.log(`Send OTP Success to ${to}`);
      return {proceed: true};
    } else {
      console.log("Error Sending OTP");
      console.log(responseJson);
      return {proceed: false};
    }
  }).catch(e => {
    console.log("Error Sending OTP");
    console.log(e);
    return {proceed: false};
  });
};
