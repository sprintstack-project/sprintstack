import { connection } from 'next/server';
import { list } from '@/lib/list';

// Lets the Android app use passkeys for this domain through Credential Manager, and open its
// https links as verified App Links (intentFilters in app.config.ts).
export const GET = async () => {
  // Read the env at request time; otherwise Cache Components prerenders this at build.
  await connection();
  const fingerprints = list(process.env.ANDROID_CERT_FINGERPRINTS);
  return Response.json(
    fingerprints.length
      ? [
          {
            relation: [
              'delegate_permission/common.handle_all_urls',
              'delegate_permission/common.get_login_creds',
            ],
            target: {
              namespace: 'android_app',
              package_name: 'com.sprintstack.app',
              sha256_cert_fingerprints: fingerprints,
            },
          },
        ]
      : [],
  );
};
