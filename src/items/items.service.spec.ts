import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { ItemsService } from './items.service';
import { Item, ItemStatus } from '../../generated/prisma/client';
import { NotFoundException } from '@nestjs/common';

const mockPrismaService = {
  item: {
    findMany: jest.fn().mockResolvedValue([]),
    findUnique: jest.fn(),
  },
};

describe('ItemsServiceTest', () => {
  let itemsService: ItemsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ItemsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    itemsService = module.get<ItemsService>(ItemsService);
  });

  describe('findAll', () => {
    it('正常系', async () => {
      const expected = [];
      const result = await itemsService.findAll();
      expect(result).toEqual(expected);
    });
  });

  describe('findById', () => {
    it('正常系', async () => {
      const item: Item = {
        id: 'test-id1',
        name: 'test-name1',
        price: 100,
        description: '',
        status: ItemStatus.ON_SALE,
        userId: 'test-userId1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrismaService.item.findUnique.mockResolvedValue(item);
      const result = await itemsService.findById('test-id1');
      expect(result).toEqual(item);
    });

    it('異常系', async () => {
      mockPrismaService.item.findUnique.mockResolvedValue(null);
      await expect(itemsService.findById('test-id1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
