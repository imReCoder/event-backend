import { Transaction } from './transaction.schema'
import { ITransaction, ITransactionModel } from './transaction.interface'
import { HTTP400Error } from '../../lib/utils/httpErrors';
const transactionSelect:string = "amount type metadata status createdAt";


class TransactionModel {
    public async create(body: ITransaction): Promise<ITransactionModel> {
        let t = new Transaction(body);
        return await t.add();
    }

    // public async fetchTransactionByQuizId(quiz:IQuizModel) {
    //     try {
    //         const transaction = Transaction.find({
    //             $and: [{ 'metadata.roomId': quiz._id }, { 'amount': quiz.poolAmount }, {
    //                 'metadata.type': 'Debit'
    //             }, { 'status': 'TXN_SUCCESS' },{'type':'Payment'}]
    //         });

    //         console.log(transaction);
    //         return transaction;
    //     } catch (e) {
    //         throw new HTTP400Error(e);
    //     }
    // }
    public async fetchTransactionsByUserId(userId:string,status:string=''){
        let transactions;
        if(status && (status=='TXN_FAILURE' || status=='TXN_SUCCESS' || status=='PENDING')){
            transactions = await Transaction.find({userId:userId,status:status},transactionSelect).lean();
        }else {
            transactions = await Transaction.find({userId:userId},transactionSelect).lean();
        }

            return transactions;
    }

    public async changeStatusOfTransaction(id: string, status: string) {
        try {
            const transaction = await Transaction.findOneAndUpdate({ _id: id }, {
                $set: { 'status': status }
            });

            if (transaction.status == status) {
                return { proceed: true };
            } else {
                return { proceed: false };
            }
        } catch (e) {
            throw new HTTP400Error(e);
        }
    }

}

export default new TransactionModel();