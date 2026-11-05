import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service.js';
import { WorkItemsService } from './work-items.service.js';

describe('WorkItemsService', () => {
  let service: WorkItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkItemsService, { provide: PrismaService, useValue: {} }],
    }).compile();

    service = module.get<WorkItemsService>(WorkItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
