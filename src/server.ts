import { config } from "dotenv";
import ioserver, { Socket } from 'socket.io';
import { Server } from "socket.io";
import { createServer } from "http";
import liveQuizModel from "./components/liveQuiz/liveQuiz.model";
import { Request } from "express";
// import ioclient from 'socket.io-client';
// import * as http from "http";
import { log } from "util";

// Initializing the dot env file very early of this project to use every where
config({ path: './config.env' });

// calling app to create server :: Our logics will belong to this app.
import { app } from "./app";

// Set PORT in .env or use 3000 by default  
const Port:number = process.env.PORT ? + process.env.PORT : 8000;

// // Create http server [non ssl]
const server = createServer(app);

let io = new Server(8080);

io.on("connection", (socket: Socket)=> {
  console.log("a user connected");
  let userId = "";
  socket.on("message", msg => {
    console.log(msg);
  });

  socket.on('joinRoom', async ({ userId, roomId }) =>{
    const user = await liveQuizModel.joinRoom(socket.id, userId, roomId);
        userId = userId;
        // connecting user to roomId
        if (user.proceed) {
            socket.join(user.roomId);
    }
    
    const quesion = await liveQuizModel.getQuestions(userId, socket.id);
    socket.emit("startQuiz", quesion);
  });
});

// io.emit("startQuiz",await liveQuizModel.getQuestions())

server.listen(Port, () => {
    console.log(`Listening to port ${Port}`);
});

export default io;