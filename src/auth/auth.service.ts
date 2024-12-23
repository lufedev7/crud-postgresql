import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async register({ name, password, email }: RegisterDto) {
    const seachUser = await this.usersService.findByEmail(email);
    if (seachUser) {
      throw new BadRequestException('Email already exists');
    }
    await this.usersService.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
    });
    return {
      name,
      email,
    };
  }
  async login({ email, password }: LoginDto) {
    const user = await this.usersService.findOneByEmailWithPassword(email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const payload = { email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken, email };
  }
  async profile({ email, role }: { email: string; role: string }) {
    return await this.usersService.findByEmail(email);
  }
}
