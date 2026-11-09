import type { User } from '@sprintstack/api-client/documents/users';
import { use } from 'react';

const FirstName = ({ me }: { me: Promise<User | null> }) => use(me)?.name.split(' ')[0];

export default FirstName;
