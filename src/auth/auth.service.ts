import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/signup/schema/user.schema';
import { RefreshTokenDTO } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async refreshToken(
    refreshTokenDto: RefreshTokenDTO,
  ): Promise<{ accessToken: string }> {
    const { refreshToken } = refreshTokenDto;

    console.log('Received Refresh Token:', refreshToken); // Basic log

    try {
      const payload = this.jwtService.verify(refreshToken);
      console.log('Decoded Payload:', payload); // Basic log

      const accessToken = this.jwtService.sign(
        { id: payload.id, name: payload.name },
        { expiresIn: '15m' },
      );

      return { accessToken };
    } catch (e) {
      console.error('Token Verification Error:', e.message); // Basic log
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
