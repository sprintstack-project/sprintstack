import { APIError } from 'better-auth/api';
import { z } from 'zod';
import type { PrismaClient } from '../generated/prisma/client';

const projectIdSchema = z.uuid();

/**
 * An invite can name a project, so accepting it puts the person on that project as well as in the
 * organization. Without one they'd join with no projects to see.
 */
export const invitationProjectHooks = (prisma: PrismaClient) => ({
  /** Only a project in this organization that the inviter is on can be handed out. */
  beforeCreateInvitation: async ({
    invitation,
    inviter,
    organization,
  }: {
    invitation: { email: string; projectId?: string | null };
    inviter: { id: string };
    organization: { id: string };
  }) => {
    const { projectId } = invitation;
    if (!projectId) return;
    const project =
      projectIdSchema.safeParse(projectId).success &&
      (await prisma.project.findFirst({
        where: {
          id: projectId,
          organizationId: organization.id,
          archivedAt: null,
          members: { some: { userId: inviter.id } },
        },
        select: { id: true },
      }));
    if (!project) {
      throw new APIError('BAD_REQUEST', { message: 'You can’t invite people to that project.' });
    }
  },

  /** Read back from the database: the project may have been deleted since the invite was sent. */
  afterAcceptInvitation: async ({
    invitation,
    user,
  }: {
    invitation: { id: string };
    user: { id: string };
  }) => {
    const stored = await prisma.invitation.findUnique({
      where: { id: invitation.id },
      select: { projectId: true },
    });
    if (!stored?.projectId) return;
    const key = { projectId: stored.projectId, userId: user.id };
    await prisma.projectMember.upsert({
      where: { projectId_userId: key },
      create: key,
      update: {},
    });
  },
});
