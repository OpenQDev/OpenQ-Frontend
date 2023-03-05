import Link from 'next/link';
import React from 'react';

const TermsOfUse = () => {
  return (
    <div className='flex flex-col items-center justify-center bg-dark-mode'>
      <div className='flex flex-col w-[1000px] p-12'>
        <h1 className='text-3xl pb-8 self-center font-bold'>Website Terms and Conditions of Use</h1>
        <h2 className='text-2xl font-bold py-2'>1. Terms of Use</h2>
        <p className='pb-4'>
          Thank you for using OpenQ, our blockchain-based escrow service for hackathons. Please be aware that our
          service is currently in active development and is still in the beta stage. By using our service, you
          acknowledge that you are aware of the risks involved with beta software and that we cannot guarantee the
          service will be free of bugs, errors, or interruptions.{' '}
        </p>
        <p className='pb-4'>
          {' '}
          Additionally, please note that our service is based on a blockchain, which is an evolving technology and
          subject to its own set of risks and challenges. While we take all necessary precautions, like audits to ensure
          the security and reliability of our service, we cannot guarantee that it will be immune to attacks or other
          security issues.{' '}
        </p>
        <p className='pb-4'>
          By using our service, you agree to assume all risks associated with its use and release us from any liability
          arising from your use of our service. We do not accept responsibility for any loss or damages, including but
          not limited to financial losses, arising from your use of our service.{' '}
        </p>
        <p className='pb-4'>
          We reserve the right to modify or terminate the service at any time without prior notice. We also reserve the
          right to modify this disclaimer from time to time without prior notice. It is your responsibility to regularly
          check this page for updates.
        </p>{' '}
        <p className='pb-4'>
          Thank you for your understanding and cooperation. If you have any questions or concerns, please do not
          hesitate to contact us.{' '}
        </p>
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
        <p className='pb-4'>
          By using our service, you agree to assume all risks associated with its use and release us from any liability
          arising from your use of our service. We do not accept responsibility for any loss or damages, including but
          not limited to financial losses, arising from your use of our service.
          <br />
          The Interface is provided without any guarantees or warranties, whether express or implied, and is subject to
          availability. We do not make any representations or warranties regarding the accuracy, completeness,
          reliability, or security of the Interface. Your use of the Interface is entirely at your own risk. We do not
          guarantee that your access to the Interface will be uninterrupted, timely, or error-free, nor do we assume any
          responsibility for any harmful elements or viruses that may affect your use of the Interface. Any advice or
          information provided by us does not create any warranty concerning the Interface. We do not endorse or
          guarantee any statements, advertisements, or offers made by third parties regarding the Interface.
          <br />
          The Protocol is provided without any warranties and is used at your own risk. Although we were involved in
          creating the initial code, we do not control or own the Protocol, and it operates autonomously through smart
          contracts on various blockchains. We and other developers involved in creating the Protocol will not be held
          liable for any damages, claims, or losses arising from your use, inability to use, or interactions with other
          users of the Protocol, including but not limited to direct, indirect, incidental, special, exemplary,
          punitive, or consequential damages, or loss of cryptocurrencies, tokens, profits, or other valuable items. We
          do not endorse, guarantee, or take responsibility for any statements, advertisements, or offers made by third
          parties regarding the Protocol.
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
