import userController from "./user.controller";


export default [
  {
    path: "/user/search",
    method: "get",
    adminOnly: true,
    handler: [userController.searchUsers]
  },
  {
    path: "/user",
    method: "get",
    adminOnly: true,
    handler: [userController.fetchAll]
  },
  {
    path: "/user/dailyStats",
    method: "get",
    adminOnly: true,
    handler: [userController.fetchDailyStats]
  },
  {
    path: "/user",
    method: "post",
    escapeAuth: true,
    handler: [userController.create]
  },
  {
    path: "/user/:id",
    method: "get",
    handler: [userController.fetch]
  },
  {
    path: "/user/:id/verify-otp",
    method: "get",
    escapeAuth: true,
    handler: [userController.verifyOtp]
  },
  {
    path: "/user/login",
    method: "post",
    escapeAuth: true,
    handler: [userController.login]
  },
  {
    path: "/user/adminLogin",
    method: "post",
    escapeAuth: true,
    handler: [userController.adminLogin]
  },
];

