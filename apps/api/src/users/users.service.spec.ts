import { BadRequestException } from '@nestjs/common';
import { vi } from 'vitest';
import type { PrismaService } from '../prisma/prisma.service';
import type { StorageService } from '../storage/storage.service';
import { UsersService } from './users.service';

const setup = (stored: string | null = null) => {
  const user = {
    findUniqueOrThrow: vi.fn().mockResolvedValue({ id: 'u1', image: stored }),
    update: vi.fn().mockResolvedValue({ id: 'u1', image: stored }),
  };
  const storage = {
    getFileDownloadUrl: vi.fn().mockResolvedValue('https://signed'),
    getFileUploadUrl: vi.fn().mockResolvedValue({ url: 'https://bucket', fields: [] }),
  };
  const service = new UsersService(
    { user } as unknown as PrismaService,
    storage as unknown as StorageService,
  );
  return { service, user, storage };
};

describe('UsersService profile', () => {
  it('finds the current user by id alone, since an invited person has no organization yet', async () => {
    const { service, user } = setup();
    await expect(service.getCurrentUser('u1')).resolves.toMatchObject({ id: 'u1', image: null });
    expect(user.findUniqueOrThrow.mock.calls[0][0].where).toEqual({ id: 'u1' });
  });

  it('makes upload keys under the person and pins the content type', async () => {
    const { service, storage } = setup();
    const { key } = await service.createAvatarUpload('u1', 'image/png');
    expect(key).toMatch(/^avatars\/u1\/.+/);
    expect(storage.getFileUploadUrl).toHaveBeenCalledWith(key, 'image/png');
  });

  it("refuses an image key outside the person's own uploads", async () => {
    const { service, user } = setup();
    await expect(
      service.updateCurrentUser('u1', { image: 'avatars/u2/photo' }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(user.update).not.toHaveBeenCalled();
  });

  it('clears the photo and job title on null, and keeps what is left out', async () => {
    const { service, user } = setup();
    await service.updateCurrentUser('u1', { image: null, jobTitle: '' });
    expect(user.update.mock.calls[0][0].data).toEqual({ image: null, jobTitle: null });
    user.update.mockClear();
    await service.updateCurrentUser('u1', { name: 'Mira' });
    expect(user.update.mock.calls[0][0].data).toEqual({ name: 'Mira' });
  });

  it('passes external photo URLs through unsigned', async () => {
    const { service, storage } = setup('https://avatars.githubusercontent.com/u/1');
    const me = await service.updateCurrentUser('u1', { name: 'Mira' });
    expect(me?.image).toBe('https://avatars.githubusercontent.com/u/1');
    expect(storage.getFileDownloadUrl).not.toHaveBeenCalled();
  });
});
