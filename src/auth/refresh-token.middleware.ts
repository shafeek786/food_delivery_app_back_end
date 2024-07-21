// src/auth/refresh-token.middleware.ts
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class RefreshTokenMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    let accessToken = req.cookies['accessToken'];
    if (!accessToken) {
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
    next();
  }
}
