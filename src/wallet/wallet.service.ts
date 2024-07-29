import { Injectable, NotFoundException } from '@nestjs/common';
import { Wallet } from './schema/wallet.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateWalletDto } from './dto/wallet.DTO';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Wallet.name)
    private readonly walletModel: Model<Wallet>,
  ) {}

  async addToWallet(userId: string, amount: number) {
    if (amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    let wallet = await this.walletModel.findOne({ userId }).exec();
    if (!wallet) {
      wallet = new this.walletModel({
        userId: new Types.ObjectId(userId),
        balance: 0,
        transactions: [],
      });
    }

    const currentBalance = Number(wallet.balance);
    const amountToWallet = Number(amount);

    if (isNaN(currentBalance) || isNaN(amountToWallet)) {
      throw new Error('Balance or amount is not a valid number');
    }

    wallet.balance = parseFloat((currentBalance + amountToWallet).toFixed(2));

    const transaction = {
      transactionId: new Types.ObjectId(),
      type: 'credit',
      amount: amount,
      timestamp: new Date(),
      status: 'completed',
      method: 'addMoney',
    };

    wallet.transactions.push(transaction);

    await wallet.save();
    return { success: true, wallet };
  }

  async getBalance(
    userId: string,
  ): Promise<{ success: boolean; wallet: CreateWalletDto }> {
    try {
      const wallet = await this.walletModel.findOne({ userId }).exec();
      if (!wallet || wallet.balance === undefined) {
        throw new NotFoundException('Balance not found');
      }

      const walletDto: CreateWalletDto = {
        userId: wallet.userId.toString(),
        balance: wallet.balance,
        transactions: wallet.transactions.map((transaction) => ({
          transactionId: transaction.transactionId.toString(),
          type: transaction.type,
          amount: transaction.amount,
          timestamp: transaction.timestamp,
          status: transaction.status,
          method: transaction.method,
        })),
      };

      return { success: true, wallet: walletDto };
    } catch (error) {
      console.log(error);
      throw new Error('Error retrieving balance');
    }
  }
}
