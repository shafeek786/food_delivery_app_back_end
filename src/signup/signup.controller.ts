import {
  Body,
  ConflictException,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SignupService } from './signup.service';
import { user } from './dto/user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('signup')
export class SignupController {
  constructor(private signupService: SignupService) {}
  @Post()
  @UseGuards(AuthGuard())
  async addUser(@Body() user: user): Promise<{ message: string }> {
    try {
      return this.signupService.addUser(user);
    } catch (err) {
      if (err instanceof ConflictException) {
        throw new HttpException(err.message, HttpStatus.CONFLICT);
      }
      throw new HttpException(
        'internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
