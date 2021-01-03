import Moment from 'moment-timezone'
import cron from 'node-cron';
import Quiz from '../../components/quiz/quiz.model'

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
  cron.schedule('*/15 * * * *', async () => {
    console.log('running cron job');
    let d1 = new Date();
    let d2 = new Date(d1);
    d2.setMinutes(d2.getMinutes() + 30);
    const condition = {
      hidden: false,
      scheduled: true,
      startDate: { $lte: d2 }
    };
    console.log(condition);

    const quizzes = await Quiz.fetchUsersToNotify(condition);
    for (const quiz of quizzes) {
      // console.log(eNews);
      try {
        const body = {
          firstName: quiz.user.firstName,
          title: quiz.title,
          start: Moment.tz(quiz.startDate.toISOString(), 'Asia/Kolkata').format('MMMM Do YYYY, h:mm a')
        };
        console.log(body);
        const message = await Quiz.sendQuizStartNotification(body);
        console.log('hi');
      } catch (e) {
        console.log(e);
      }
    }
  });
  console.log("Scheduled Cron Tab");
} else {
  console.log("Not Setting Cron Tab");
}
