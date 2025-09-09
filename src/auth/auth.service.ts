import { Injectable } from '@nestjs/common';
import { User, UserStatus } from '../../generated/prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    return await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        status: UserStatus.FREE
      },
    });
  }
}
