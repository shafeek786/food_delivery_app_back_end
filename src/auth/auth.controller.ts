import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('refresh-token')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refreshToken'];
    const newTokens = await this.authService.refreshToken({ refreshToken });

    res.cookie('accessToken', newTokens.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return res.json(newTokens);
  }

  @Get('check-auth')
  async checkAuth(@Req() req: Request, @Res() res: Response) {
    const accessToken = req.cookies['accessToken'];
    console.log('check auth access', accessToken);
    if (!accessToken) {
      console.log('check auth 1');
      return res.json({ isAuthenticated: false });
    }

    try {
      const decoded = jwt.decode(accessToken, { complete: true });
      if (
        decoded &&
        typeof decoded === 'object' &&
        'payload' in decoded &&
        typeof decoded.payload === 'object'
      ) {
        const payload = decoded.payload as jwt.JwtPayload;
        console.log('Decoded token:', decoded);
        const exp = payload.exp;
        const currentTime = Math.floor(Date.now() / 1000);

        if (exp) {
          const expirationDate = new Date(exp * 1000);
          console.log('Token expires at:', expirationDate.toUTCString());
          if (exp < currentTime) {
            console.log('Token has expired');
            return res.json({
              isAuthenticated: false,
              message: 'Token has expired',
            });
          }
        } else {
          console.log('Token does not have an expiration time');
        }
      } else {
        console.log('Invalid token structure');
        return res.json({
          isAuthenticated: false,
          message: 'Invalid token structure',
        });
      }
      // const decoded = jwt.decode(accessToken) as jwt.JwtPayload | null
      const payload = this.jwtService.verify(accessToken);
      return res.json({ isAuthenticated: true, id: payload.id });
    } catch (error) {
      console.log('check auth 2');
      return res.json({ isAuthenticatedd: false });
    }
  }

  @Post('logout')
  async logout(
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return { message: 'Logged out successfully' };
  }
}
