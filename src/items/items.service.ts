import { Injectable, NotFoundException } from '@nestjs/common';
import { Item } from './items.model';

@Injectable()
export class ItemsService {
  private readonly items: Item[] = [];

  findAll(): Item[] {
    return this.items;
  }

  findById(id: string): Item | undefined {
    return this.items.find((item) => item.id === id);
  }

  create(item: Item): Item {
    this.items.push(item);
    return item;
  }

  update(id: string, name: string, price: number, description: string): Item {
    const item = this.findById(id);
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    item.name = name;
    item.price = price;
    item.description = description;
    return item;
  }

  delete(id: string): void {
    const item = this.findById(id);
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    const index = this.items.findIndex((item) => item.id === id);
    this.items.splice(index, 1);
  }
}
