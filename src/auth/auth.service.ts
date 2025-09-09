import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User, UserStatus } from '../../generated/prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { CredentialsDto } from './dto/credentials.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { JwsPayload } from '../types/jwsPayload';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    return await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        status: UserStatus.FREE,
      },
    });
  }

  async signIn(credentialsDto: CredentialsDto): Promise<{ token: string }> {
    const { email, password } = credentialsDto;
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwsPayload = {
        sub: user.id,
        username: user.name,
        status: user.status,
      };
      const token = this.jwtService.sign(payload);
      return { token };
    }

    throw new UnauthorizedException('Invalid credentials');
  }
}
