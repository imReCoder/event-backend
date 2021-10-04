import { LeaderBoard } from './leaderboard.schema'
import { ILeaderBoardModel } from './leaderboard.interface'
import { Result } from '../result/result.schema'
import { Quiz } from '../quiz/quiz.schema'
import { IQuizModel } from '../quiz/quiz.interface'
import { IResult, IResultModel } from '../result/result.interface'
import mongoose from 'mongoose';
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

    private async fetchResults(roomId: string) {
        const results = await Result.aggregate([
            {
                $match: { roomId: new mongoose.Types.ObjectId(roomId) }
            },
            {
                $lookup: {
                    from: 'quizrooms',
                    localField: 'roomId',
                    foreignField:'_id',
                    as:'roomId'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignfield: '_id',
                    as:'userId'
                }
            },
            {
                 $sort: {score:-1} 
            }
        ]);

        return results;
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
        // const results = await Result.find({
        //     roomId: roomId
        // }).sort({ score: -1 }).lean();

        const results = await this.fetchResults(roomId);

        const quizData = await Quiz.findById(roomId) as IQuizModel;
        const startingPoint = await this.buildResultTemplate(quizData._id);
        const board: any = this.countResult(results, startingPoint);
        board.last_count = timeNow;
        board.roomId = roomId;
        board.result = results;

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

    };


    public async leaderboardAlgorithm(roomId: string) {

        try {
            const quiz = await Quiz.findById(roomId);

            const numberofplayer: any = quiz.totalRegistrations;
            const numberofwinner = quiz.metadata.minPlayers;
            const entryamount = quiz.poolAmount;
            const totalMoney = numberofplayer * entryamount;
            const pollAmount = Math.floor(totalMoney - (0.05 * totalMoney));
            const minPrize = Math.floor(1.2 * entryamount);

            console.log(numberofplayer, numberofwinner, entryamount);
            const a = 1.2;
            let maxPrize = pollAmount - (numberofwinner * minPrize);

            let totalDist = 0;

            let prizes = [];

            for (let i = numberofwinner; i > 0; i--) {
                const priceOfIthPlayer = Math.floor(((maxPrize - minPrize) / Math.pow(i, a)));
                totalDist += (priceOfIthPlayer + minPrize);
                prizes[i - 1] = priceOfIthPlayer + minPrize;
                maxPrize -= priceOfIthPlayer;
            }

            let remain = pollAmount - totalDist;
      
            totalDist = 0;
            let equilizer = 1;
          
            for (let i = 1; i <= numberofwinner; i++) {
                equilizer *= 2;
                prizes[i - 1] += Math.floor(remain / equilizer);
                totalDist += prizes[i - 1];
            }
        
            prizes[0] += pollAmount - totalDist;
            
            return prizes;
        } catch (e) {
            throw Error(e);
        }
    }
}

export default new LeaderBoardModel();