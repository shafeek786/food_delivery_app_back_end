import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
export class CartToAdd {
  @IsString()
  @IsNotEmpty()
  item: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
