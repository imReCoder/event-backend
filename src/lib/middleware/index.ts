import { handleBodyRequestParsing, allowCors, reqConsoleLogger,handleCompression, requestLimiter, useHelmet } from "./common.middleware";

export default [useHelmet,handleBodyRequestParsing, allowCors, reqConsoleLogger, handleCompression, requestLimiter];
