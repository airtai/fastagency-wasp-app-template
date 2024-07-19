import { AuthUser } from 'wasp/auth';
import { logout } from 'wasp/client/auth';
import CustomAuthRequiredLayout from '../app/layout/CustomAuthRequiredLayout';
import Button from '../components/Button';

const AccountPage = ({ user }: { user: AuthUser }) => {
  const username = user.identities.username?.id;
  return (
    <div className='mt-10 px-6'>
      <div className='overflow-hidden border border-primary shadow-lg sm:rounded-lg lg:m-8 dark:border-gray-100/10'>
        <div className='px-4 py-5 sm:px-6 lg:px-8'>
          <h3 className='text-base font-semibold leading-6 text-white dark:text-white'>Account Information</h3>
        </div>
        <div className='border-t border-primary dark:border-gray-100/10 px-4 py-5 sm:p-0'>
          <dl className=' sm:dark:divide-gray-100/10'>
            <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
              <dt className='text-sm font-medium text-white dark:text-white'>Username</dt>
              <dd className='mt-1 text-sm text-white dark:text-white sm:col-span-2 sm:mt-0'>{username}</dd>
            </div>
          </dl>
        </div>
      </div>
      <div className='inline-flex w-full justify-end'>
        <Button onClick={logout} label='logout' />
      </div>
    </div>
  );
};

const AccountPageWithCustomAuth = CustomAuthRequiredLayout(AccountPage);
export default AccountPageWithCustomAuth;
