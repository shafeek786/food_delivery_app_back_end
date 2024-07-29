import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { cart, CartSchema } from './schema/cart.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: cart.name, schema: CartSchema }]),
  ],
  providers: [CartService],
  controllers: [CartController],
})
export class CartModule {}
