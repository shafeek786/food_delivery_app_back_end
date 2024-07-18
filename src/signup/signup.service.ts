import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import mongoose from 'mongoose';
import { user } from './dto/user.dto';

@Injectable()
export class SignupService {
  constructor(
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
  ) {}
  async addUser(user: user): Promise<{ message: string; success: boolean }> {
    const { email, mobile } = user;

    const existingUser = await this.userModel
      .findOne({ $or: [{ email }, { mobile }] })
      .exec();

    if (existingUser) {
      throw new ConflictException('email id or mobile number already exist');
    }
    const userCreated = new this.userModel(user);
    await userCreated.save();

    return { message: 'user registered successfully', success: true };
  }
}
