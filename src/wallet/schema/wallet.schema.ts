import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { User } from 'src/signup/schema/user.schema';

@Schema({ _id: false })
class Transaction {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId })
  @IsString()
  transactionId: Types.ObjectId;

  @Prop({ required: true })
  @IsString()
  type: string;

  @Prop({ required: true })
  @IsNumber()
  amount: number;

  @Prop({ required: true })
  @IsDate()
  timestamp: Date;

  @Prop({ required: true })
  @IsString()
  status: string;

  @Prop({ required: true })
  @IsString()
  method: string;
}

const TransactionSchema = SchemaFactory.createForClass(Transaction);

@Schema({
  timestamps: true,
})
export class Wallet extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  @Type(() => User)
  userId: Types.ObjectId;

  @Prop({ required: true })
  balance: number;

  @Prop({ type: [TransactionSchema], default: [] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Transaction)
  transactions: Transaction[];
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
export type WalletDocument = Wallet & Document;
