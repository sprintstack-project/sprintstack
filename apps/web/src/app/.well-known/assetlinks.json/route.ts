import { list } from '@/lib/list';

// Lets the Android app use passkeys for this domain through Credential Manager.
export function GET() {
  const fingerprints = list(process.env.ANDROID_CERT_FINGERPRINTS);
  return Response.json(
    fingerprints.length
      ? [
          {
            relation: ['delegate_permission/common.get_login_creds'],
            target: {
              namespace: 'android_app',
              package_name: 'com.sprintstack.app',
              sha256_cert_fingerprints: fingerprints,
            },
          },
        ]
      : [],
  );
}
