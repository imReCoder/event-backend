// import socket from 'socket.io';
// import  server  from '../../server';
import { IQuizModel, IQuiz } from '../quiz/quiz.interface';
import liveQuizModel from './liveQuiz.model';
import { Quiz } from '../quiz/quiz.schema';
import { schedule } from 'node-cron';

// const io = socket(server);

// io.on('connection', (socket:any) => {
//     socket.on('joinRoom', async (userId: any, roomId: any) => {
//         const user = await liveQuizModel.joinRoom(socket.id, roomId);

//         // connecting user to roomId
//         if (user.proceed) {
//             socket.join(user.roomId);
//         }
//     });

//     // start Quiz
//     socket.on('startQuiz',async (roomId: any) => {
//         // getting quiz from roomId
//         const questions = await liveQuizModel.getQuestions(socket.id,roomId);
//         let index = 0;
//         schedule('* * * * *', async () => {
//             console.log("Running job livequiz......");
//             //emitting question to user
//             socket.emit('question', questions.questions[index++]);
//         });
//     });

//     // when user answers the quesion
//     socket.on('answer', async (resultId:any,answer: any, roomId: any, userId: any) => {
//         const result = await liveQuizModel.resultCalc(resultId, answer, roomId, socket.id);
        
//         if (!result) {
//             // do something
//         }
//     });

//     // when user discoonects

//     socket.on('disconnect', () => {
//         console.log("user left");
//     });
// });


