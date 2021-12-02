"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const http_1 = require("http");
// Initializing the dot env file very early of this project to use every where
(0, dotenv_1.config)({ path: './config.env' });
// calling app to create server :: Our logics will belong to this app.
const app_1 = require("./app");
// Set PORT in .env or use 3000 by default  
const Port = process.env.PORT ? +process.env.PORT : 8000;
// // Create http server [non ssl]
const server = (0, http_1.createServer)(app_1.app);
// let io = new Server(8080);
// io.on("connection", (socket: Socket)=> {
//   console.log("a user connected");
//   let userId = "";
//   socket.on("message", msg => {
//     console.log(msg);
//   });
//   socket.on('joinRoom', async ({ userId, roomId }) => {
//     console.log(userId, roomId);
//     const user = await liveQuizModel.joinRoom(socket.id, userId, roomId);
//         userId = userId;
//         // connecting user to roomId
//         if (user.proceed) {
//             socket.join(user.roomId);
//         }
//       schedule('* * * * *', async () => {
//         const quesion = await liveQuizModel.getQuestions(userId, socket.id);
//         socket.emit("startQuiz", quesion);
//       });
//   });
//   socket.on('submitAnswer', async ({ userId, roomId, answer, questionId }) => {
//      await liveQuizModel.resultCalc(questionId, answer, userId, roomId);
//   });
// });
// io.emit("startQuiz",await liveQuizModel.getQuestions())
server.listen(Port, () => {
    console.log(`Listening to port ${Port}`);
});
//# sourceMappingURL=server.js.map