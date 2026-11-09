import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service.js';
import { ActivityService, MAX_ACTIVITY_PAGE_SIZE } from './activity.service.js';

describe('ActivityService', () => {
  let service: ActivityService;
  const findMany = vi.fn();

  beforeEach(async () => {
    findMany.mockReset().mockResolvedValue([]);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivityService,
        { provide: PrismaService, useValue: { activity: { findMany } } },
      ],
    }).compile();

    service = module.get<ActivityService>(ActivityService);
  });

  it('only reads projects the viewer is on in their organization', async () => {
    await service.getAllByProjectId('org-1', 'user-1', 'project-1');

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          projectId: 'project-1',
          project: {
            organizationId: 'org-1',
            archivedAt: null,
            members: { some: { userId: 'user-1' } },
          },
        },
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        take: 20,
      }),
    );
    expect(findMany.mock.calls[0][0]).not.toHaveProperty('cursor');
  });

  it('caps the page size and pages after a cursor', async () => {
    await service.getAllByProjectId('org-1', 'user-1', 'project-1', { first: 500, after: 'act-9' });

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: MAX_ACTIVITY_PAGE_SIZE, cursor: { id: 'act-9' }, skip: 1 }),
    );
  });

  it('builds the item key and drops the project', async () => {
    findMany.mockResolvedValue([
      {
        id: 'act-1',
        action: 'created',
        project: { key: 'PAY' },
        workItem: { id: 'item-1', number: 1482, title: 'Fix checkout' },
      },
      { id: 'act-2', action: 'updated', project: { key: 'PAY' }, workItem: null },
    ]);

    const result = await service.getAllByProjectId('org-1', 'user-1', 'project-1');

    expect(result).toEqual([
      {
        id: 'act-1',
        action: 'created',
        workItem: { id: 'item-1', number: 1482, title: 'Fix checkout', key: 'PAY-1482' },
      },
      { id: 'act-2', action: 'updated', workItem: null },
    ]);
  });
});
