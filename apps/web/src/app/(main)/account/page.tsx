import { redirect } from 'next/navigation';

/** Opens on the first section. */
const AccountPage = () => {
  redirect('/account/profile');
};

export default AccountPage;
