import { vi } from 'vitest';
import type { PrismaClient } from '../generated/prisma/client';
import { invitationProjectHooks } from './invitation-project';

const PROJECT_ID = '0199a1b2-7c3d-7e4f-8a5b-6c7d8e9f0a1b';

const setup = ({
  project = { id: PROJECT_ID } as { id: string } | null,
  storedProjectId = PROJECT_ID as string | null,
} = {}) => {
  const prisma = {
    project: { findFirst: vi.fn().mockResolvedValue(project) },
    invitation: { findUnique: vi.fn().mockResolvedValue({ projectId: storedProjectId }) },
    projectMember: { upsert: vi.fn().mockResolvedValue({}) },
  };
  return { prisma, hooks: invitationProjectHooks(prisma as unknown as PrismaClient) };
};

const creating = (projectId?: string) => ({
  invitation: { email: 'new@example.com', projectId },
  inviter: { id: 'u1' },
  organization: { id: 'o1' },
});

const accepting = { invitation: { id: 'i1' }, user: { id: 'u2' } };

describe('invitationProjectHooks', () => {
  it('lets an invite without a project through', async () => {
    const { hooks, prisma } = setup();
    await expect(hooks.beforeCreateInvitation(creating())).resolves.toBeUndefined();
    expect(prisma.project.findFirst).not.toHaveBeenCalled();
  });

  it('only accepts a project in the organization that the inviter is on', async () => {
    const { hooks, prisma } = setup();
    await hooks.beforeCreateInvitation(creating(PROJECT_ID));
    expect(prisma.project.findFirst.mock.calls[0][0].where).toMatchObject({
      id: PROJECT_ID,
      organizationId: 'o1',
      members: { some: { userId: 'u1' } },
    });
  });

  it('refuses a project the inviter cannot hand out', async () => {
    const { hooks } = setup({ project: null });
    await expect(hooks.beforeCreateInvitation(creating(PROJECT_ID))).rejects.toThrow();
  });

  it('refuses a malformed id without querying', async () => {
    const { hooks, prisma } = setup();
    await expect(hooks.beforeCreateInvitation(creating('nope'))).rejects.toThrow();
    expect(prisma.project.findFirst).not.toHaveBeenCalled();
  });

  it('adds the person to the project on accept', async () => {
    const { hooks, prisma } = setup();
    await hooks.afterAcceptInvitation(accepting);
    expect(prisma.projectMember.upsert.mock.calls[0][0].create).toEqual({
      projectId: PROJECT_ID,
      userId: 'u2',
    });
  });

  it('adds nothing when the invite has no project', async () => {
    const { hooks, prisma } = setup({ storedProjectId: null });
    await hooks.afterAcceptInvitation(accepting);
    expect(prisma.projectMember.upsert).not.toHaveBeenCalled();
  });
});
