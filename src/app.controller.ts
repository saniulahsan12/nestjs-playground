import { UserDTO } from './users/dto/user.dto';
import { Controller, Get, Request, Post, UseGuards, Sse, MessageEvent } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { ApiBody } from '@nestjs/swagger';

import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}


  @Sse('sse')
  sse(): Observable<MessageEvent> {
    return of({ data: { hello: 'world' } });
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  @ApiBody({ type: UserDTO })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
