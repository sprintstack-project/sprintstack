import { list } from '@/lib/list';

// Lets the iOS app create and use passkeys for this domain (associatedDomains in app.json).
export const GET = () => {
  return Response.json({ webcredentials: { apps: list(process.env.APPLE_APP_IDS) } });
};
