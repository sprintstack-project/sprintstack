import { GraphQLError } from 'graphql';
import { describe, expect, it, vi } from 'vitest';
import { Prisma } from '../generated/prisma/client';
import type { PrismaService } from '../prisma/prisma.service';
import { ProjectsService } from './projects.service';

const input = { name: 'Payments', key: 'PAY', description: null };

const serviceWith = (create: ReturnType<typeof vi.fn>) =>
  new ProjectsService({ project: { create } } as unknown as PrismaService);

describe('ProjectsService.create', () => {
  it('adds the creator as an admin, in the given organization', async () => {
    const create = vi.fn().mockResolvedValue({ id: 'p1', ...input, methodology: 'scrum' });

    const project = await serviceWith(create).create('org1', 'user1', input);

    expect(create.mock.calls[0][0].data).toEqual({
      ...input,
      organizationId: 'org1',
      members: { create: { userId: 'user1', role: 'admin' } },
    });
    expect(project.memberCount).toBe(1);
  });

  it('reports a key that is already taken as a conflict', async () => {
    const taken = new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
      code: 'P2002',
      clientVersion: 'test',
    });

    const error = await serviceWith(vi.fn().mockRejectedValue(taken))
      .create('org1', 'user1', input)
      .catch((e: unknown) => e);

    expect(error).toBeInstanceOf(GraphQLError);
    expect((error as GraphQLError).extensions.code).toBe('CONFLICT');
  });
});
