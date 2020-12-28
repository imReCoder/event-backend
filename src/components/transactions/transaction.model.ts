import { Transaction } from './transaction.schema'
import { ITransaction, ITransactionModel } from './transaction.interface'


class TransactionModel {

    public async create(body: ITransaction): Promise<ITransactionModel> {
        let t = new Transaction(body);
        return await t.add();
    }

}

export default new TransactionModel();