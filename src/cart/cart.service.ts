import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './schema/cart.schema';
import { Model } from 'mongoose';
import { CartToAdd } from './dto/cart.DTO';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(cart.name)
    private readonly cartModel: Model<cart>,
  ) {}

  async addToCart(userId, data: CartToAdd): Promise<{ success: boolean }> {
    const userCart = await this.cartModel.findOne({ userId }).exec();

    if (!userCart) {
      userCart = new this.cartModel({
        item: data.item,
        quantity: data.quantity,
        amount: data.amount,
      });
    }
  }
}
