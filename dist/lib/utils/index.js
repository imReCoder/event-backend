"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaginationInfo = exports.mongoDBProjectFields = exports.applyRoutes = exports.applyMiddleware = void 0;
const auth_middleware_1 = require("../middleware/auth.middleware");
// load all middleware with this function call
const applyMiddleware = (middlewareWrappers, router) => {
    for (const wrapper of middlewareWrappers) {
        wrapper(router);
    }
};
exports.applyMiddleware = applyMiddleware;
// loading all routes and initialize to use them.
const applyRoutes = (routes, router) => {
    for (const route of routes) {
        const { method, path, escapeAuth, handler, adminOnly, role } = route;
        if (escapeAuth) {
            router[method](path, handler);
        }
        else if (role) {
            router[method](path, [auth_middleware_1.Authorization, (0, auth_middleware_1.RoleAuthorization)(role), ...handler]);
        }
        else if (adminOnly) {
            router[method](path, [auth_middleware_1.Authorization, auth_middleware_1.AdminAuthorization, ...handler]);
        }
        else {
            router[method](path, [auth_middleware_1.Authorization, ...handler]);
        }
    }
    return router;
};
exports.applyRoutes = applyRoutes;
const mongoDBProjectFields = (fieldsString, prefix) => {
    const result = {};
    fieldsString.split(' ').map(field => {
        if (prefix) {
            result[prefix + '.' + field] = 1;
        }
        else {
            result[field] = 1;
        }
    });
    return result;
};
exports.mongoDBProjectFields = mongoDBProjectFields;
const getPaginationInfo = (pageNo = 1) => {
    const limit = 2;
    const skip = (pageNo - 1) * limit;
    return { limit, skip };
};
exports.getPaginationInfo = getPaginationInfo;
//# sourceMappingURL=index.js.map