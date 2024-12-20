import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}
  async register({ name, password, email }: RegisterDto) {
    const seachUser = await this.usersService.findByEmail(email);
    if (seachUser) {
      throw new BadRequestException('Email already exists');
    }
    return await this.usersService.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
    });
  }
  async login({ email, password }: LoginDto) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return user;
  }
}
