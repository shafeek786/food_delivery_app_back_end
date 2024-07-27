import { Prop, Schema } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/signup/schema/user.schema';

Schema({
  timestamps: true,
});

export class Wallet extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  @Type(() => User)
  userId: MongooseSchema.Types.ObjectId;
  @Prop({ required: true })
  balance: string;

  @Prop({})
  transacion: [];
}
