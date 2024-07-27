import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from 'src/auth/auth.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class RefreshTokenMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies['accessToken'];

    if (accessToken && this.isTokenExpired(accessToken)) {
      await this.refreshTokens(req, res);
    } else if (!accessToken) {
      await this.refreshTokens(req, res);
    }

    next();
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decoded = jwt.decode(token) as jwt.JwtPayload | null;
      if (decoded && decoded.exp) {
        const currentTime = Math.floor(Date.now() / 1000);
        return decoded.exp < currentTime;
      }
    } catch (error) {
      console.log('Failed to decode access token', error.message);
    }
    return true;
  }

  private async refreshTokens(req: Request, res: Response): Promise<void> {
    const refreshToken = req.cookies['refreshToken'];
    if (refreshToken) {
      try {
        const newTokens = await this.authService.refreshToken({
          refreshToken,
        });
        console.log('New access token generated:', newTokens.accessToken);
        res.cookie('accessToken', newTokens.accessToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
        });
        req.cookies['accessToken'] = newTokens.accessToken;
      } catch (e) {
        console.log('Failed to refresh access token:', e.message);
      }
    } else {
      console.log('No refresh token found');
    }
  }
}
