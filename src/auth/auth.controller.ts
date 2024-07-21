import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';

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
    if (!accessToken) {
      return res.json({ isAuthenticated: false });
    }

    try {
      this.jwtService.verify(accessToken);
      return res.json({ isAuthenticated: true });
    } catch (error) {
      return res.json({ isAuthenicated: false });
    }
  }
}
