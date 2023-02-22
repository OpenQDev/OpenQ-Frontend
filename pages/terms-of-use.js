import Link from 'next/link';
import React from 'react';

const TermsOfUse = () => {
  return (
    <div className='flex flex-col items-center justify-center bg-dark-mode'>
      <div className='flex flex-col w-[1000px] p-12'>
        <h1 className='text-3xl pb-8 self-center font-bold'>Website Terms and Conditions of Use</h1>
        <h2 className='text-2xl font-bold py-2'>1. Terms</h2>
        <p className='pb-4'>
          By accessing this Website, accessible from www.openq.dev, you are agreeing to be bound by these Website Terms
          and Conditions of Use and agree that you are responsible for the agreement with any applicable local laws. If
          you disagree with any of these terms, you are prohibited from accessing this site. The materials contained in
          this Website are protected by copyright and trade mark law.
        </p>
        <h2 className='text-2xl font-bold py-2'>2. Use License </h2>
        <div className='pb-4'>
          Permission is granted to temporarily download one copy of the materials on OpenQs Website for personal,
          non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under
          this license you may not:
          <ul className='my-4 ml-4 list-disc'>
            <li>modify or copy the materials;</li>
            <li>use the materials for any commercial purpose or for any public display;</li>
            <li>attempt to reverse engineer any software contained on OpenQs Website;</li>
            <li>remove any copyright or other proprietary notations from the materials; or</li>
            <li>transferring the materials to another person or mirror the materials on any other server.</li>{' '}
          </ul>
          This will let OpenQ to terminate upon violations of any of these restrictions. Upon termination, your viewing
          right will also be terminated and you should destroy any downloaded materials in your possession whether it is
          printed or electronic format. These Terms of Service has been created with the help of the Terms Of Service
          Generator.
        </div>
        <h2 className='text-2xl font-bold py-2'>3. Disclaimer </h2>
        <p className='pb-4'>
          All the materials on OpenQs Website are provided as is. OpenQ makes no warranties, may it be expressed or
          implied, therefore negates all other warranties. Furthermore, OpenQ does not make any representations
          concerning the accuracy or reliability of the use of the materials on its Website or otherwise relating to
          such materials or any sites linked to this Website.
        </p>
        <h2 className='text-2xl font-bold py-2'>4. Limitations </h2>
        <p className='pb-4'>
          OpenQ or its suppliers will not be hold accountable for any damages that will arise with the use or inability
          to use the materials on OpenQs Website, even if OpenQ or an authorize representative of this Website has been
          notified, orally or written, of the possibility of such damage. Some jurisdiction does not allow limitations
          on implied warranties or limitations of liability for incidental damages, these limitations may not apply to
          you.{' '}
        </p>
        <h2 className='text-2xl font-bold py-2'>5. Revisions and Errata </h2>
        <p className='pb-4'>
          The materials appearing on OpenQs Website may include technical, typographical, or photographic errors. OpenQ
          will not promise that any of the materials in this Website are accurate, complete, or current. OpenQ may
          change the materials contained on its Website at any time without notice. OpenQ does not make any commitment
          to update the materials.{' '}
        </p>
        <h2 className='text-2xl font-bold py-2'>6. Links</h2>
        <p className='pb-4'>
          OpenQ has not reviewed all of the sites linked to its Website and is not responsible for the contents of any
          such linked site. The presence of any link does not imply endorsement by OpenQ of the site. The use of any
          linked website is at the users own risk.{' '}
        </p>
        <h2 className='text-2xl font-bold py-2'>7. Site Terms of Use Modifications </h2>
        <p className='pb-4'>
          OpenQ may revise these Terms of Use for its Website at any time without prior notice. By using this Website,
          you are agreeing to be bound by the current version of these Terms and Conditions of Use.{' '}
        </p>
        <h2 className='text-2xl font-bold py-2'>8. Your Privacy </h2>
        <p className='pb-4'>
          Please read our{' '}
          <Link
            href={'/privacy-policy'}
            target='_blank'
            rel='noopener noreferrer'
            className='text-link-colour hover:underline w-full truncate'
          >
            Privacy Policy
          </Link>
          .{' '}
        </p>
        <h2 className='text-2xl font-bold py-2'>9. Governing Law </h2>
        <p className='pb-4'>
          Any claim related to OpenQs Website shall be governed by the laws of de without regards to its conflict of law
          provisions.
        </p>
      </div>
    </div>
  );
};

export default TermsOfUse;
