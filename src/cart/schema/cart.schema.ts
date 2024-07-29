import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString, IsNumber } from 'class-validator';
import { Document } from 'mongoose';

Schema({
  timestamps: true,
});

export class Cart extends Document {
  @Prop({ required: true })
  @IsString()
  item: string;

  @Prop({ required: true })
  @IsNumber()
  quantity: number;

  @Prop({ required: true })
  @IsNumber()
  amount: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
