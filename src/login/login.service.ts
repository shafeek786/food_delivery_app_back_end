// src/login/login.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/signup/schema/user.schema';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from './dto/login.dto';

@Injectable()
export class LoginService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async login(
    loginDto: LoginDTO,
  ): Promise<{ accessToken: string; refreshToken: string; message: string }> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid email Id');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    const accessToken = this.jwtService.sign(
      { id: user._id, name: user.name },
      { expiresIn: '15m' },
    );
    const refreshToken = this.jwtService.sign(
      { id: user._id, name: user.name },
      { expiresIn: '7d' },
    );

    return { accessToken, refreshToken, message: 'Logged in Success' };
  }
}
