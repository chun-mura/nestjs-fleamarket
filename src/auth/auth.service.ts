import { Injectable } from '@nestjs/common';
import { User, UserStatus } from '../../generated/prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, password } = createUserDto;
    return await this.prisma.user.create({
      data: {
        name,
        email,
        password,
        status: UserStatus.FREE
      },
    });
  }
}
