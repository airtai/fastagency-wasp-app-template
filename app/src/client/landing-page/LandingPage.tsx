import { Link } from 'wasp/client/router';
import { useAuth } from 'wasp/client/auth';
import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { AiFillCloseCircle } from 'react-icons/ai';
import { HiBars3 } from 'react-icons/hi2';
import { BiLogIn } from 'react-icons/bi';
import logo from '../static/logo.svg';
import openSaasBanner from '../static/open-saas-banner.png';
import { features, navigation, faqs, footerNavigation, testimonials } from './contentSections';
import DropdownUser from '../components/DropdownUser';
import { UserMenuItems } from '../components/UserMenuItems';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: user, isLoading: isUserLoading } = useAuth();

  const NavLogo = () => <img className='h-8' src={logo} style={{ width: '1.8rem' }} alt='logo' />;
  const appName = import.meta.env.REACT_APP_NAME || 'Your SaaS';

  return (
    <div className='dark:text-white dark:bg-boxdark-2'>
      {/* Header */}
      <header className='bg-primary absolute inset-x-0 top-0 z-50 dark:bg-boxdark-2'>
        <nav className='flex items-center justify-between p-6 lg:px-8' aria-label='Global'>
          <div className='flex items-center lg:flex-1'>
            <a
              href='/'
              className='flex items-center -m-1.5 p-1.5 text-white duration-300 ease-in-out hover:text-secondary'
            >
              <NavLogo />
              <span className='ml-2 text-4xl font-rubik text-white leading-6 dark:text-white'>{appName}</span>
            </a>
          </div>
          <div className='flex lg:hidden'>
            <button
              type='button'
              className='-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white dark:text-white'
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className='sr-only'>Open main menu</span>
              <HiBars3 className='h-6 w-6' aria-hidden='true' />
            </button>
          </div>
          <div className='hidden lg:flex lg:gap-x-12'>
            {navigation.map((item, index) => {
              const isFirstItem = index === 0;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-semibold leading-6 duration-300 ease-in-out hover:text-secondary dark:text-white ${
                    isFirstItem ? 'text-secondary' : 'text-white'
                  }`}
                >
                  {item.name}
                </a>
              );
            })}
          </div>
          <div className='hidden lg:flex lg:flex-1 lg:justify-end lg:align-end'>
            {/* <!-- Dark Mode Toggler --> */}
            <div className='flex items-center gap-3 2xsm:gap-7'>
              {isUserLoading ? null : !user ? (
                <Link to='/login'>
                  <div className='text-sm flex justify-end items-center duration-300 ease-in-out text-white hover:text-secondary dark:text-white'>
                    Log in <BiLogIn size='1.1rem' className='ml-1' />
                  </div>
                </Link>
              ) : (
                <DropdownUser user={user} />
              )}
            </div>
          </div>
        </nav>
        <Dialog as='div' className='lg:hidden' open={mobileMenuOpen} onClose={setMobileMenuOpen}>
          <div className='fixed inset-0 z-50' />
          <Dialog.Panel className='fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-white dark:bg-boxdark dark:text-white'>
            <div className='flex items-center justify-between'>
              <a href='/' className='-m-1.5 p-1.5'>
                <span className='sr-only'>Your SaaS</span>
                <NavLogo />
              </a>
              <button
                type='button'
                className='-m-2.5 rounded-md p-2.5 text-white dark:text-gray-50'
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className='sr-only'>Close menu</span>
                <AiFillCloseCircle className='h-6 w-6' aria-hidden='true' />
              </button>
            </div>
            <div className='mt-6 flow-root'>
              <div className='-my-6 divide-y divide-white'>
                <div className='space-y-2 py-6'>
                  {navigation.map((item, index) => (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`${
                        index === 0 ? 'text-secondary' : ''
                      } -mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-primary hover:bg-gray-50 dark:text-white dark:hover:bg-boxdark-2`}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className='py-6'>
                  {isUserLoading ? null : !user ? (
                    <Link to='/login'>
                      <div className='text-sm flex justify-start items-center duration-300 ease-in-out text-white hover:text-secondary dark:text-white'>
                        Log in <BiLogIn size='1.1rem' className='ml-1' />
                      </div>
                    </Link>
                  ) : (
                    <UserMenuItems user={user} />
                  )}
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>

      <main className='isolate dark:bg-boxdark-2'>
        {/* Hero section */}
        <div className='relative pt-14 w-full '>
          <div className='py-24 sm:py-32'>
            <div className='mx-auto max-w-8xl px-6 lg:px-8'>
              <div className='lg:mb-18 mx-auto max-w-5xl text-center'>
                <h1 className='text-4xl font-rubik text-white sm:text-6xl dark:text-white'>
                  Introducing <span className='italic'>{appName}</span>: Your AI-Powered Chat Solution
                </h1>
                <p className='mt-6 mx-auto max-w-2xl text-lg leading-8 text-white dark:text-white'>
                  Elevate your customer engagement with {appName}, the AI-powered chat solution that delivers
                  personalized responses and evolves with your business needs.
                </p>
                <div className='mt-10 flex items-center justify-center gap-x-6'>
                  {user ? (
                    <a
                      href='/chat'
                      className={`rounded-md px-3.5 py-2.5 text-sm  bg-primary text-white hover:bg-opacity-85 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                    >
                      Go to chat <span aria-hidden='true'>→</span>
                    </a>
                  ) : (
                    <a
                      href='/signup'
                      className={`rounded-md px-3.5 py-2.5 text-sm  bg-primary text-white hover:bg-opacity-85 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                    >
                      Create an account
                    </a>
                  )}
                </div>
              </div>
              <div className='mt-14 flow-root sm:mt-14 '>
                <div className='-m-2 rounded-xl  lg:-m-4 lg:rounded-2xl lg:p-4'>
                  <img
                    src={openSaasBanner}
                    alt='App screenshot'
                    width={2432}
                    height={1442}
                    className='rounded-md shadow-2xl '
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature section */}
        <div id='features' className='mx-auto mt-5 max-w-7xl px-6 lg:px-8'>
          <div className='mx-auto max-w-2xl text-center'>
            <p className='mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl dark:text-white'>
              <span className='text-white'>Features</span>
            </p>
          </div>
          <div className='mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl'>
            <dl className='grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16'>
              {features.map((feature) => (
                <div key={feature.name} className={`relative pl-16`}>
                  <dt className='text-base font-semibold leading-7 text-white dark:text-white'>
                    <div className='absolute left-0 top-0 flex h-10 w-10 items-center justify-center border border-white bg-white-100/50 dark:bg-boxdark rounded-lg'>
                      <div className='text-2xl'>{feature.icon}</div>
                    </div>
                    {feature.name}
                  </dt>
                  <dd className='mt-2 text-base leading-7 text-white dark:text-white'>{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* FAQ */}
        <div className='mx-auto max-w-2xl divide-y divide-gray-900/10 dark:divide-gray-200/10 px-6 pb-8 sm:pb-24 sm:pt-12 lg:max-w-7xl lg:px-8 lg:py-32'>
          <h2 className='text-2xl font-bold leading-10 tracking-tight text-white dark:text-white'>
            Frequently asked questions
          </h2>
          <dl className='mt-10 space-y-8 divide-y divide-gray-900/10'>
            {faqs.map((faq) => (
              <div key={faq.id} className='pt-8 lg:grid lg:grid-cols-12 lg:gap-8'>
                <dt className='text-base font-semibold leading-7 text-white lg:col-span-5 dark:text-white'>
                  {faq.question}
                </dt>
                <dd className='flex items-center justify-start gap-2 mt-4 lg:col-span-7 lg:mt-0'>
                  <p className='text-white leading-7 text-primary dark:text-white'>{faq.answer}</p>
                  {faq.href && (
                    <a href={faq.href} className='text-white leading-7 text-primary hover:opacity-80'>
                      Learn more →
                    </a>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </main>
    </div>
  );
}
