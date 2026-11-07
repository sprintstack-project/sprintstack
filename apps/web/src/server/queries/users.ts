import 'server-only';

import { MeQuery } from '@sprintstack/api-client/documents/users';
import { cache } from 'react';
import { serverQuery } from '@/server/api';

/** The signed-in person. Deduped per request. */
export const getViewer = cache(async () => (await serverQuery(MeQuery, {})).me);
