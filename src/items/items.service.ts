import { Injectable, NotFoundException } from '@nestjs/common';
import { Item, ItemStatus } from '../../generated/prisma/client';
import { CreateItemDto } from './dto/create-item.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ItemsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Item[]> {
    return await this.prisma.item.findMany();
  }

  async findById(id: string): Promise<Item> {
    const item = await this.prisma.item.findUnique({
      where: { id },
    });
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    return item;
  }

  async create(createItemDto: CreateItemDto, userId: string): Promise<Item> {
    const { name, price, description } = createItemDto;
    return await this.prisma.item.create({
      data: {
        name,
        price,
        description,
        status: ItemStatus.ON_SALE,
        userId,
      },
    });
  }

  async update(
    id: string,
    name: string,
    price: number,
    description: string,
  ): Promise<Item> {
    const item = await this.findById(id);
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    return await this.prisma.item.update({
      where: { id },
      data: { name, price, description },
    });
  }

  async delete(id: string, userId: string): Promise<void> {
    const item = await this.findById(id);
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    await this.prisma.item.delete({
      where: { id, userId },
    });
  }
}
