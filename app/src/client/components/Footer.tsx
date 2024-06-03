import { footerNavigation } from '../landing-page/contentSections';

export default function Footer() {
  return (
    <div className='bg-primary px-6 lg:px-8 dark:bg-boxdark-2 pb-15 mt-30 sm:mt-40'>
      <section className='relative'></section>
      <footer aria-labelledby='footer-heading' className='relative border-white dark:border-gray-200/10'>
        <h2 id='footer-heading' className='sr-only'>
          Footer
        </h2>
        <div className='flex items-start justify-end mt-10 gap-20 mx-auto max-w-7xl sm:px-6 lg:px-8'>
          <div>
            <ul role='list' className='mt-6 space-y-4'>
              {footerNavigation.company.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className='text-sm leading-6 text-white hover:underline dark:text-white'
                    target={`${item.name === 'airt' ? '_blank' : '_self'}`}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
