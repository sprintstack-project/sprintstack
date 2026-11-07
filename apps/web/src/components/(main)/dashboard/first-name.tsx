import type { UserSummary } from '@sprintstack/api-client/documents/users';
import { use } from 'react';

const FirstName = ({ viewer }: { viewer: Promise<UserSummary> }) => use(viewer).name.split(' ')[0];

export default FirstName;
