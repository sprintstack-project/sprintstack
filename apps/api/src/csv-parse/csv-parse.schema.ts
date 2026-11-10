import { z } from 'zod';

/** The limit the `content` arg's description promises. */
export const csvContentSchema = z
  .string()
  .min(1, 'The file is empty.')
  .max(100_000, 'The file is over 100,000 characters.');
