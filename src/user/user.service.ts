import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { user } from 'src/signup/dto/user.dto';
import { User } from 'src/signup/schema/user.schema';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async getUserById(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    console.log(user);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUserById(userId: string, data: user): Promise<User> {
    const { email, mobile } = data;

    const userByEmail = await this.userModel.findOne({ email });
    if (userByEmail && userByEmail._id.toString() !== userId) {
      throw new ConflictException('Email ID already exists');
    }

    const userByMobile = await this.userModel.findOne({ mobile });
    if (userByMobile && userByMobile._id.toString() !== userId) {
      throw new ConflictException('Mobile number already exists');
    }

    const user = await this.userModel.findByIdAndUpdate(userId, data, {
      new: true,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
