export default function PrivacyPage() {
  const appName = import.meta.env.REACT_APP_NAME || 'Your SaaS';
  const supportEmail = import.meta.env.REACT_APP_SUPPORT_EMAIL;
  return (
    <div>
      <div className='mx-auto max-w-2xl pl-10 pr-10 text-white pt-10 pb-24 sm:pb-32 lg:gap-x-8 lg:py-5 lg:px-8'>
        <div className='container mx-auto py-8'>
          <h1 className='text-3xl font-semibold mb-4'>Privacy Policy</h1>
          <p className='text-white mb-4'>Last updated Jun 4, 2024</p>

          <section className='mb-8'>
            <p>
              {appName} ("we", "us", or "our") is committed to protecting the privacy of our users. This Privacy Policy
              explains how we collect, use, and disclose information through our software service (the "Service").
            </p>
          </section>
          <section className='mb-8'>
            <h2 className='text-xl font-semibold mb-2'>Information We Collect</h2>
            <p>
              We value your privacy and are committed to ensuring the highest level of confidentiality and security for
              your information. Here's what you need to know about the information we collect when you use our Service:
            </p>
            <br />
            <ul className='list-decimal pl-6'>
              <li>
                <b>Account Information:</b> When you create an account, we collect basic information about you. This
                information is essential to personalize your experience and enable various features of the Service.
              </li>
              <li>
                <b>Integrations:</b> As you integrate your various platforms with our Service, we collect information
                that you input, including the details about the platforms you're connecting and any associated data.
                This data is necessary to provide you with accurate analytics, reports, and insights.
              </li>
              <li>
                <b>Usage Information:</b> To help us understand how you interact with our Service and enable us to
                improve your user experience, we collect information about your usage. This may include log data, device
                information, and other data related to your activities within our Service.
              </li>
              <li>
                <b>Data Processing:</b> Your data's privacy is a top priority. We process data on-the-fly and do not
                store any data in databases, except for necessary data. This ensures your data stays where it
                belongs—with you.
              </li>
            </ul>
          </section>

          <section className='mb-8'>
            <p>We use the information we collect to:</p>
            <br />
            <ul className='list-disc pl-6'>
              <li>Provide, Maintain, and Improve the Service</li>
              <li>Respond to Your Requests and Inquiries</li>
              <li>Communicate with You</li>
              <li>Analyze and Monitor Usage</li>
              <li>Detect, Investigate, and Prevent Fraud and Other Illegal Activities</li>
            </ul>
          </section>
          <section className='mb-8'>
            <h2 className='text-xl font-semibold mb-2'>Third-Party and Proprietary AI Tools</h2>
            <p>
              Our service utilizes advanced AI technology. This approach allows us to generate contextually relevant and
              accurate responses based on your interactions and queries, ensuring a high-quality user experience.
            </p>
            <br />
            <ul className='list-decimal pl-6'>
              <li>
                <b>Data Storage:</b> While we do not directly store raw data from third-party sources, it's crucial to
                understand that your data may contain references to or summaries of data from these services. This data
                is securely stored in a cloud-based database, in compliance with the cloud provider's privacy policy.
              </li>
              <li>
                <b>Opt-Out Options:</b> If you choose to withdraw your consent and opt-out of data sharing with
                third-party tools, you will no longer be able to use our service. The nature of our tool requires data
                sharing for its basic functionality. Therefore, opting out effectively means discontinuing use of the
                service.
              </li>
              <li>
                <b>Data Retention:</b> We retain the information we collect for as long as necessary to provide the
                Service and fulfill the purposes described in this Privacy Policy. When we no longer need the
                information, we will securely delete it or de-identify it.
              </li>
              <li>
                <b>Security:</b> We take reasonable measures to protect your information from unauthorized access, use,
                disclosure, and destruction. However, no method of transmission over the internet or method of
                electronic storage is completely secure.
              </li>
              <li>
                <b>Changes to this Privacy Policy:</b> We may update this Privacy Policy from time to time. If we make
                any material changes, we will notify you by email or by posting a notice on our website prior to the
                change becoming effective.
              </li>
            </ul>
          </section>
          {supportEmail && (
            <section className='mb-8'>
              <h2 className='text-xl font-semibold mb-2'>Contact Us</h2>
              <p>
                In order to receive further information regarding use of the Site, please contact us at:{' '}
                <a href={`mailto:${supportEmail}`}>{supportEmail}</a>.
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
