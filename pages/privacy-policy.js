import Link from 'next/link';
import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className='flex flex-col items-center justify-center bg-dark-mode'>
      <div className='flex flex-col w-[1000px] p-12'>
        <h1 className='text-3xl pb-8 self-center font-bold'>Our Privacy Policy</h1>
        <p className='pb-4'>
          At OpenQ , accessible from www.openq.dev, one of our main priorities is the privacy of our visitors. This
          Privacy Policy document contains types of information that is collected and recorded by OpenQ and how we use
          it.
        </p>

        <p className='pb-4'>
          If you have additional questions or require more information about our Privacy Policy, do not hesitate to
          contact us. Our Privacy Policy was generated with the help of{' '}
          <Link
            href='https://www.gdprprivacypolicy.net/'
            target='_blank'
            rel='noopener noreferrer'
            className='text-link-colour hover:underline w-full truncate'
          >
            GDPR Privacy Policy Generator from GDPRPrivacyPolicy.net
          </Link>
        </p>

        <h2 className='py-2 font-bold text-2xl'>General Data Protection Regulation (GDPR)</h2>
        <p className='pb-4'>We are a Data Controller of your information.</p>

        <p className='pb-4'>
          OpenQ legal basis for collecting and using the personal information described in this Privacy Policy depends
          on the Personal Information we collect and the specific context in which we collect the information:
        </p>
        <ul className='list-disc pl-5 pb-4'>
          <li>OpenQ needs to perform a contract with you</li>
          <li>You have given OpenQ permission to do so</li>
          <li>Processing your personal information is in OpenQ legitimate interests</li>
          <li>OpenQ needs to comply with the law</li>
        </ul>

        <p className='pb-4'>
          OpenQ will retain your personal information only for as long as is necessary for the purposes set out in this
          Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal
          obligations, resolve disputes, and enforce our policies.
        </p>

        <p className='pb-4'>
          If you are a resident of the European Economic Area (EEA), you have certain data protection rights. If you
          wish to be informed what Personal Information we hold about you and if you want it to be removed from our
          systems, please contact us.
        </p>

        <p className='pb-4'>In certain circumstances, you have the following data protection rights:</p>
        <ul className='list-disc pl-5 pb-4'>
          <li>The right to access, update or to delete the information we have on you.</li>
          <li>The right of rectification.</li>
          <li>The right to object.</li>
          <li>The right of restriction.</li>
          <li>The right to data portability</li>
          <li>The right to withdraw consent</li>
        </ul>

        <h2 className='py-2 font-bold text-2xl'>Log Files</h2>

        <p className='pb-4'>
          OpenQ follows a standard procedure of using log files. These files log visitors when they visit websites. All
          hosting companies do this and a part of hosting services analytics. The information collected by log files
          include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp,
          referring/exit pages, and possibly the number of clicks. These are not linked to any information that is
          personally identifiable. The purpose of the information is for analyzing trends, administering the site,
          tracking users movement on the website, and gathering demographic information.
        </p>

        <h2 className='py-2 font-bold text-2xl'>Cookies and Web Beacons</h2>

        <p className='pb-4'>
          Like any other website, OpenQ uses cookies. These cookies are used to store information including visitors
          preferences, and the pages on the website that the visitor accessed or visited. The information is used to
          optimize the users experience by customizing our web page content based on visitors browser type and/or other
          information.
        </p>

        <p className='pb-4'>
          For more general information on cookies, please read the{' '}
          <Link
            href='https://www.generateprivacypolicy.com/#cookies'
            target='_blank'
            rel='noopener noreferrer'
            className='text-link-colour hover:underline w-full truncate'
          >
            Cookies article here.
          </Link>
          .
        </p>

        <h2 className='font-bold text-2xl'>Privacy Policies</h2>

        <p className='pb-4'>
          You may consult this list to find the Privacy Policy for each of the advertising partners of OpenQ .
        </p>

        <p className='pb-4'>
          Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used
          in their respective advertisements and links that appear on OpenQ , which are sent directly to users browser.
          They automatically receive your IP address when this occurs. These technologies are used to measure the
          effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on
          websites that you visit.
        </p>

        <p className='pb-4'>
          Note that OpenQ has no access to or control over these cookies that are used by third-party advertisers.
        </p>

        <h2 className='font-bold text-2xl'>Third Party Privacy Policies</h2>

        <p className='pb-4'>
          OpenQs Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult
          the respective Privacy Policies of these third-party ad servers for more detailed information. It may include
          their practices and instructions about how to opt-out of certain options.{' '}
        </p>

        <p className='pb-4'>
          You can choose to disable cookies through your individual browser options. To know more detailed information
          about cookie management with specific web browsers, it can be found at the browsers respective websites.
        </p>

        <h2 className='py-2 font-bold text-2xl'>Childrens Information</h2>

        <p className='pb-4'>
          Another part of our priority is adding protection for children while using the internet. We encourage parents
          and guardians to observe, participate in, and/or monitor and guide their online activity.
        </p>

        <p className='pb-4'>
          OpenQ does not knowingly collect any Personal Identifiable Information from children under the age of 13. If
          you think that your child provided this kind of information on our website, we strongly encourage you to
          contact us immediately and we will do our best efforts to promptly remove such information from our records.
        </p>

        <h2 className='py-2 font-bold text-2xl'>Online Privacy Policy Only</h2>

        <p className='pb-4'>
          Our Privacy Policy created at GDPRPrivacyPolicy.net) applies only to our online activities and is valid for
          visitors to our website with regards to the information that they shared and/or collect in OpenQ . This policy
          is not applicable to any information collected offline or via channels other than this website.
        </p>

        <h2 className='py-2 font-bold text-2xl'>Consent</h2>

        <p className='pb-4'>By using our website, you hereby consent to our Privacy Policy and agree to its terms.</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
