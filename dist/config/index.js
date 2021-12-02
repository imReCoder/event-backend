"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleOAuth = exports.IKC = exports.paginationConfig = exports.s3Config = exports.textLocalConfig = exports.commonConfig = exports.rateLimitConfig = exports.configCors = exports.mongoUrl = void 0;
const mongoUrl = () => {
    const configs = {
        dbAccess: process.env.DB_ACCESS || "local",
        user: process.env.DB_USER || "",
        pass: process.env.DB_PASS || "",
        cluster: process.env.DB_CLUSTER || "",
        db: process.env.DB || "pol-bol"
    };
    if (configs.dbAccess === "local") {
        return `mongodb://localhost:27017/${configs.db}`;
    }
    return `mongodb+srv://${configs.user}:${configs.pass}@${configs.cluster}.mongodb.net/${configs.db}?retryWrites=true`;
};
exports.mongoUrl = mongoUrl;
exports.configCors = {
    // Allow your domains to restrict ill apis.
    allowOrigin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:8081',
        // End
        'http://polbol.in',
        'http://www.polbol.in',
        'http://polboladmin.s3-website.ap-south-1.amazonaws.com',
        'http://polbolwebsite.s3-website.ap-south-1.amazonaws.com',
        'http://polboladmin-staging.s3-website.ap-south-1.amazonaws.com',
        'https://securegw-stage.paytm.in',
        'https://securegw.paytm.in',
        'https://main.d1k8spudwn7j2p.amplifyapp.com',
        'https://main.d2qffe2mfx34l9.amplifyapp.com',
        'http://polbol.s3-website.ap-south-1.amazonaws.com',
        'https://ikc-play-new.d1gv456ibcg3vs.amplifyapp.com',
        'https://quizando.netlify.app',
        'https://quizando.netlify.app/',
    ],
    // Expose additional which are restricted.
    exposedHeaders: ["X-Auth"]
};
exports.rateLimitConfig = {
    inTime: process.env.REQUEST_TIME || 60 * 1000,
    maxRequest: process.env.MAX_REQUEST || 60
};
exports.commonConfig = {
    jwtSecretKey: process.env.SECRET_KEY || "some-secret-key",
    pageSizeLimit: 15,
};
exports.textLocalConfig = {
    apiKey: process.env.TEXTLOCAL_KEY || ''
};
exports.s3Config = {
    accessKey: process.env.S3_ACCEESS_ID || "",
    secretKey: process.env.S3_SECRET_KEY || "",
    sign: process.env.S3_SIGN_VERSION || 'v4',
    region: process.env.S3_REGION || "us-east-1",
    url: process.env.S3_URL || "",
};
exports.paginationConfig = {
    MAX_NEWS: 30,
    MAX_VIDEOS: 30,
    MAX_POLL: 15,
    MAX_POST: 30,
    MAX_TIMELINE: 30,
    MAX_LIKES: 100,
    MAX_COMMENTS: 30,
    MAX_REPLIES: 5,
    MAX_USERS: 100,
    MAX_AWARDS: 15,
    MAX_NOTIFICATIONS: 50
};
exports.IKC = {
    URL: 'localhost:3000',
    API_KEY: 'dnjskfnjksj32i@32opo'
};
exports.googleOAuth = {
    CLIENT_ID: '737333346336-s4mkj3ud2l79rug8tgg7u1u1231g6u94.apps.googleusercontent.com',
    CLIENT_SECRET: 'xOE1E9P46fTZo2Kwq6UsE7Rs',
    REDIRECT: 'http://ec2-13-235-90-125.ap-south-1.compute.amazonaws.com:2112/api/v1/user/login/socialAuth/google/callBack'
};
//# sourceMappingURL=index.js.map