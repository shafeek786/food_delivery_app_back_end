import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddToWallet {
  @IsNumber()
  @IsNotEmpty()
  readonly amount: number;

  @IsString()
  @IsNotEmpty()
  readonly method: string;

  @IsString()
  @IsNotEmpty()
  readonly type: string;
}
