import { LeaderBoard } from './leaderboard.schema'
import { ILeaderBoardModel } from './leaderboard.interface'
import { Result } from '../result/result.schema'
import { Quiz } from '../quiz/quiz.schema'
import { IQuizModel } from '../quiz/quiz.interface'
import { IResult, IResultModel } from '../result/result.interface'

type resultTemplate = {
    avatar: string,
    userName: string,
    score: number,
    time: Date,
    prize: number
}

class LeaderBoardModel {

    private default = 'roomId last_count result'

    private FieldsofQuizRoom = "title maxScore timeAlloted level category icon metadata visibility poolamount startDate endDate isFreebie"

    private async buildResultTemplate(roomId: string) {
        return {
            roomId: roomId,
            result: [{
                avatar: '',
                userName: '',
                score: 0,
                time: new Date(),
                prize: 0
            }],
            last_count: new Date()
        }
    }

    private async countResult(results: IResultModel[], startingPoint: any) {
        let resultsArray : resultTemplate[] = [];
        for(let result of results){
            
        }
        startingPoint.result = resultsArray;
        return startingPoint;
    }

    async getAwardResults(roomId: string) {

        const data = await LeaderBoard.findOne({
            roomId: roomId
        }).populate('roomId', this.FieldsofQuizRoom);

        console.log('async section complete ' + data);
        let update = false;
        if (data) {
            console.log('data was found already existing');
            let timeDelta = new Date().getTime() - data.last_count;
            timeDelta = timeDelta / 1000;
            console.log(timeDelta);
            if (timeDelta < 300) {
                console.log("Returning Cached Results");
                return data;
            }
            // else count votes
            console.log("Re-Calc Award Poll Results");
            update = true;
        }
        const timeNow = new Date().getTime();
        const results = await Result.find({
            roomId: roomId
        }).sort({ score: -1 }).lean();

        const quizData = await Quiz.findById(roomId) as IQuizModel;
        const startingPoint = await this.buildResultTemplate(quizData._id);
        const board: any = this.countResult(results, startingPoint);
        board.last_count = timeNow;
        board.award = roomId;

        let newBoard;
        if (update) {
            const leaderBoardId = (data as ILeaderBoardModel)._id as string;
            newBoard = await LeaderBoard.findOneAndUpdate({ _id: leaderBoardId }, board, { new: true }) as ILeaderBoardModel;
        } else {
            console.log("Adding Document");
            const newResult = new LeaderBoard(board);
            newBoard = await newResult.save();
        }
        newBoard = newBoard.toJSON();
        return {
            ...newBoard,
        };

    }
}

export default new LeaderBoardModel()