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
exports.getSignUrl = exports.s3UploadMulter = exports.s3 = void 0;
const aws_sdk_1 = require("aws-sdk");
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const httpErrors_1 = require("../utils/httpErrors");
const config_1 = require("../../config");
exports.s3 = new aws_sdk_1.S3({
    accessKeyId: config_1.s3Config.accessKey,
    secretAccessKey: config_1.s3Config.secretKey,
    signatureVersion: config_1.s3Config.sign,
    region: config_1.s3Config.region
});
exports.s3UploadMulter = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: exports.s3,
        bucket: 'ikcdeal-bucket',
        acl: 'public-read',
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            console.log(file);
            cb(null, Date.now().toString() + '-' + file.originalname);
        }
    })
});
const getSignedUrl = (Key, ContentType) => {
    return new Promise((resolve, reject) => {
        exports.s3.getSignedUrl('putObject', {
            Bucket: "polbol-images",
            ContentType: 'multipart/form-data',
            Key
        }, (err, url) => {
            if (err) {
                reject(err);
            }
            console.log(url);
            resolve(url);
        });
    });
};
// Get sign url::
const getSignUrl = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { folder, key, ContentType, userId } = data;
        const Key = (userId ? `${folder}/${userId}-${new Date().getTime()}${path_1.default.extname(key)}` : `${folder}/${new Date().getTime()}${path_1.default.extname(key)}`);
        return { Key, url: yield getSignedUrl(Key, ContentType) };
    }
    catch (e) {
        throw new httpErrors_1.HTTP400Error("This url has already been used", "Please create new url then try");
    }
});
exports.getSignUrl = getSignUrl;
//# sourceMappingURL=s3.js.map