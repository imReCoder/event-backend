import quizController from "./quiz.controller";
import resultController from "../result/result.controller"
import userController from "../user/user.controller";
export default [
  {
    path: "/quiz/create",
    method: "post",
    adminOnly: true,
    handler: [quizController.create]
  },
  {
    path: '/quiz/AddCategory',
    method: 'post',
    adminOnly: true,
    handler: [quizController.addCategory]
  },
  {
    path: '/quiz/fetchAllCategories',
    method: "get",
    escapeAuth: true,
    handler: [quizController.findAllActiveCategories]
  },
  {
    path: '/quiz/fetchQuiz',
    method: "get",
    handler: [quizController.fetchAllActiveQuiz]
  },
  {
    path: '/quiz/start',
    method: 'get',
    handler: [quizController.start]
  },
  {
    path: '/quiz/submitAnswer',
    method: 'get',
    handler: [resultController.submitAnswer]
  },
  {
    path: '/quiz/timedOut',
    method: 'get',
    handler: [resultController.timedOut]
  },
  {
    path: '/quiz/end',
    method: 'get',
    handler: [resultController.end]
  },
  {
    path: '/quiz/ruleBook',
    method: 'get',
    escapeAuth: true,
    handler: [quizController.ruleBook]
  },
  {
    path: '/quiz/register',
    method: 'post',
    handler: [userController.isVerified,quizController.checkQuiz,quizController.registerForQuiz]
  },
  {
    path:'/quiz/:id/participants',
    method: 'get',
    handler:[quizController.getParticipants]
  },
  {
    path: '/quiz/:id/leaderboard',
    method: 'get',
    handler:[quizController.getLeaderboard]
  },
  {
    path: '/quiz/:id/prize',
    method: 'get',
    handler:[quizController.getPrize]
  }
];
