import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

import { TypeRoles } from '../common/enums/rol.enum';
import { Auth } from './decorators/auth.decorator';
import { ActiveUser } from '../common/decorators/active-user.decorator';
import { UserActiveInterface } from '../common/interface/user-active.interface';

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
  @Auth(TypeRoles.USER)
  profile(@ActiveUser() user: UserActiveInterface) {
    return this.authService.profile(user);
  }
}
