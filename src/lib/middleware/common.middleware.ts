import { json, Router, urlencoded, Request } from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
/* Custom imports */
import { configCors, rateLimitConfig } from "../../config";
import { requestLogger } from "./requestLogger";


export const useHelmet = (router: Router) => {
  router.use(helmet());
};

const corsOptionsDelegate = (req: Request, callback: any) => {

  let origin = req.header('Origin')
  // console.log('Request Origin :',origin)
  if (!origin) {
    return callback(null, { origin: true });
  } else {
    let corsOptions;
    let isDomainAllowed = configCors.allowOrigin.indexOf(origin) !== -1;
    let isPathAllowed = req.path.toString().includes('wallet');
    // console.log('isDomainAllowed',isDomainAllowed)
    if (isDomainAllowed || isPathAllowed) {
      // Enable CORS for this request
      corsOptions = { origin: true, exposedHeaders: 'X-Auth' }
    } else {
      // Disable CORS for this request
      corsOptions = { origin: false }
    }
    callback(null, corsOptions)
  }
}

export const allowCors = (router: Router) => {

  router.use(cors(corsOptionsDelegate));
};

/* here all middleware come. Don't need to do anything in app.js*/
export const handleBodyRequestParsing = (router: Router) => {
  router.use(urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 }));
  router.use(json({ limit: "10mb" }));
};

// Logging all request in console.
export const reqConsoleLogger = (router: Router) => {
  router.use(requestLogger);
};

// Compress the payload and send through api
export const handleCompression = (router: Router) => {
  router.use(compression());
};

export const requestLimiter = (router: Router) => {
  const limiter = rateLimit({
    windowMs: +rateLimitConfig.inTime, // 1 minutes
    max: +rateLimitConfig.maxRequest, // limit each IP to 12 requests per windowMs,
    message: {
      status: 0,
      error: "Too Many Requests",
      statusCode: 429,
      message: "Oh boy! You look in hurry, take it easy",
      description: "You have crossed maximum number of requests. please wait and try again."
    }
  });
  router.use(limiter);
};
