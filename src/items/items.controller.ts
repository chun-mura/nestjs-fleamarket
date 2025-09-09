import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Request,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { Item } from '../../generated/prisma/client';
import { CreateItemDto } from './dto/create-item.dto';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { RequestUser } from '../types/requestUser';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  async findAll(): Promise<Item[]> {
    return await this.itemsService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Item> {
    return await this.itemsService.findById(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Body() createItemDto: CreateItemDto,
    @Request() req: ExpressRequest & { user: RequestUser },
  ): Promise<Item> {
    return await this.itemsService.create(createItemDto, req.user.id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('id') id: string,
    @Body('name') name: string,
    @Body('price') price: number,
    @Body('description') description: string,
  ): Promise<Item> {
    return await this.itemsService.update(id, name, price, description);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(
    @Param('id') id: string,
    @Request() req: ExpressRequest & { user: RequestUser },
  ): Promise<void> {
    await this.itemsService.delete(id, req.user.id);
  }
}
