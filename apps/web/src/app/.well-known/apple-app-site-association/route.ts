import { connection } from 'next/server';
import { list } from '@/lib/list';

// Lets the iOS app create and use passkeys for this domain (associatedDomains in app.json).
export const GET = async () => {
  // Read the env at request time; otherwise Cache Components prerenders this at build.
  await connection();
  return Response.json({ webcredentials: { apps: list(process.env.APPLE_APP_IDS) } });
};
