import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

import { Request } from 'express';

import { TypeRoles } from './enums/rol.enum';
import { Auth } from './decorators/auth.decorator';
interface RequestWithUser extends Request {
  user: {
    email: string;
    role: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
  /* @Get('profile')
  @Roles(TypeRoles.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  profile(@Req() req: RequestWithUser) {
    return this.authService.profile(req.user);
  } */

  @Get('profile')
  @Auth(TypeRoles.ADMIN)
  profile(@Req() req: RequestWithUser) {
    return this.authService.profile(req.user);
  }
}
