// src/login/login.controller.ts
import { Body, Controller, Post, Res } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginDTO } from './dto/login.dto';
import { Response } from 'express';

@Controller('login')
export class LoginController {
  constructor(private loginService: LoginService) {}

  @Post()
  async login(
    @Body() loginDto: LoginDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    const { accessToken, refreshToken, message } =
      await this.loginService.login(loginDto);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { message };
  }
}
