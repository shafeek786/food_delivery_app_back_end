import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class user {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  mobile: string;

  profileImage: string;
}
