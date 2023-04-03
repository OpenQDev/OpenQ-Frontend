import Link from 'next/link';
import React from 'react';

const TermsOfUse = () => {
  return (
    <div className='flex flex-col items-center justify-center bg-dark-mode'>
      <div className='flex flex-col w-[1000px] p-12'>
        <h1 className='text-3xl pb-8 self-center font-bold'>Terms of Use</h1>
        <p className='pb-4 font-bold'>Last updated: 24.03.2023</p>
        <p className='pb-4'>Thank you for using OpenQ, our blockchain-based escrow service for hackathons. </p>
        <p className='pb-4'>
          Please read these terms of use carefully. By accessing or using our services and products and by checking the
          checkbox, you confirm you have read and understood these terms of use and agree to be bound by these terms of
          use, including references which might be made to other documents/information as incorporated in our website (
          <Link
            href={'https://openq.dev/'}
            target='_blank'
            rel='noopener noreferrer'
            className='text-link-colour hover:underline w-full truncate'
          >
            https://openq.dev/
          </Link>
          ).{' '}
        </p>
        <h2 className='text-2xl font-bold py-2'>A. Scope</h2>
        <p className='pb-4'>
          These are the terms of use (hereinafter referred to as the “Terms”) of OpenQ Labs GmbH, (hereinafter referred
          to as “OpenQ, ”we”, “our” or “us”). These Terms apply to any access and use of our products and services
          (hereinafter referred to as the “Products”) as outlined on our website at{' '}
          <Link
            href={'https://openq.dev/'}
            target='_blank'
            rel='noopener noreferrer'
            className='text-link-colour hover:underline w-full truncate'
          >
            https://openq.dev/
          </Link>
          s.
        </p>
        <p className='pb-4'>The following definitions are being used in these Terms.</p>
        <ul className='list-disc list-inside pb-4'>
          <li>Customer: The Customer is the entity/person that/who funds the bounty/price.</li>
          <li>
            Developer: The Developer is the entity/person that/who solves the issue and receives the bounty/price.
          </li>
        </ul>
        <p className='pb-4'>
          In regards to the functionality and features of our Products, reference is made to our documentation, which
          you can find under the following link:{' '}
          <Link
            href={'https://docs.openq.dev/welcome/master'}
            target='_blank'
            rel='noopener noreferrer'
            className='text-link-colour hover:underline w-full truncate'
          >
            https://docs.openq.dev/welcome/master
          </Link>
          .
        </p>
        <p className='pb-4'>
          The Products provided by us are on an "AS IS" and "as available" basis, without warranties of any kind, either
          express or implied, including, without limitation, implied warranties of merchantability, fitness for a
          particular purpose or non-infringement.
        </p>
        <h2 className='text-2xl font-bold py-2'>B. Acceptance of Terms</h2>
        <p className='pb-4'>
          By accepting these Terms you enter into an agreement with OpenQ (hereinafter referred to as the “Agreement”).
        </p>
        <p className='pb-4'>
          In order to use our Products you need to first accept our Terms in full as outlined here including references
          to other documentation that might be made. A selected acceptance of our Terms is not possible. If you do not
          agree or don’t understand the Terms you may not use our Products.
        </p>
        <p className='pb-4'>
          You expressly acknowledge, agree, and understand that OpenQ merely provides a platform to be used by Customers
          and Developers. OpenQ is not in any way involved in the direct contractual relationship between Customers and
          Developers.
        </p>
        <p className='pb-4'>
          By using our Products, you warrant that you understand the inherent risks associated with blockchain
          technology.
        </p>
        <h2 className='text-2xl font-bold py-2'>C. Eligibility</h2>
        <p className='pb-4'>
          Our Products are to be used only by business people and companies. No consumer (in the sense of § 13 German
          Civil Code) is entitled to use our Products.
        </p>
        <p className='pb-4'>
          Any use of our Products by anyone under eighteen (18) years of age is strictly prohibited and in violation of
          this Agreement.
        </p>
        <p className='pb-4'>
          You represent and warrant (i) that you are of legal age to form a binding agreement, (ii) that you can form a
          binding agreement with us on behalf of the company/entity you are representing, (iii) that you are legally
          allowed to enter into this Agreement with us from within the jurisdiction you are working/using our Products
          from and that you and your company/entity are in compliance with all applicable local, state, national, and
          international laws, rules and regulations which are applicable to you and your company/entity. In case of
          doubt of compliance, it is your sole responsibility to investigate the legality of accessing our website and
          make use of our Products before you do so, (iv) that you have full power and authority to enter into this
          agreement and in doing so will not violate any other agreement to which you are a party to and (v) that you or
          your company/entity you are representing have not previously been suspended or removed from using our
          Products.
        </p>
        <h2 className='text-2xl font-bold py-2'>D. Product Security and Risks</h2>
        <p className='pb-4'>
          Please be aware that our Products are currently in active development and are still in the so-called beta
          stage. Nevertheless we see it as our responsibility to clue you in on potential risks. At the same time we do
          our best to make our Products as secure as possible.
        </p>
        <h2 className='text-xl font-bold py-2'>I. Smart Contract Bug</h2>
        <p className='pb-4'>
          In order to make our Products as secure as possible, the protocol (software code) is being audited by Sherlock
          (
          <Link
            href={'https://www.sherlock.xyz/'}
            target='_blank'
            rel='noopener noreferrer'
            className='text-link-colour hover:underline w-full truncate'
          >
            https://www.sherlock.xyz/
          </Link>
          ). If, despite our audit, we still have bugs in the smart contract that cause the prize/bounty (hereinafter
          referred to as “Bounty”) to be partially or totally withdrawn by an unknown person from the contracts or e.g.
          blocked forever in the contracts we have a monthly coverage fee that we pay to Sherlock protocol who did our
          audit and promise to pay back the amount of up to $5 Million in case of smart contract bug(s).
        </p>
        <h2 className='text-xl font-bold py-2'>II. Multi-Sig Hack</h2>
        <p className='pb-4'>
          If the majority of multi-signature participants unintentionally disclose their private keys to a cybercriminal
          through manipulation or alternative techniques, the intruder could assume control of the smart contract
          managing the Bounty agreement(s). This would result in our loss of authority over the smart contract, and the
          attacker would gain the ability to manipulate it in order to obtain all the funds held in escrow within each
          smart contract.
        </p>
        <h2 className='text-xl font-bold py-2'>III. Not yet fully decentralized </h2>
        <p className='pb-4'>
          OpenQ provides a set of smart contracts enabling multiple parties to establish a bounty program for issues on
          Github. This set of smart contracts, developed and deployed by OpenQ, can be executed and used by Customers to
          mint Bounties and fund them with rewards. The smart contracts act as an escrow service for Customers and
          Developers. By sending the funds to the Bounty contract, the Customer transfers custody over the funds to the
          smart contract. OpenQ's Oracle (Github API connection to smart contracts) determines when payments are
          released by the smart contract. This Oracle runs on the OpenQ's servers and is not yet fully decentralized
          though it plans to be. In its current implementation, OpenQ could still intervene here and manipulate the data
          from Github and thus give wrong information to the smart contract that would trigger payment transactions.
          Once the Oracle is fully decentralized OpenQ will not have control over and no way to intervene in the
          execution of smart contracts anymore.
        </p>
        <h2 className='text-xl font-bold py-2'>IV. Upgradeable smart contract</h2>
        <p className='pb-4'>
          Furthermore, the OpenQ's smart contract possesses the ability to be enhanced. In theory, OpenQ can modify
          functions to acquire entry to the escrow. The intention is to eliminate this upgradability feature, but the
          exact timeline remains uncertain. Presently, this allows us the advantage of rapid response in the event of
          glitches or the introduction of new functionalities.
        </p>
        <h2 className='text-xl font-bold py-2'>V. Underlining blockchain</h2>
        <p className='pb-4'>
          Please note that our Products are, as of now, based on the Polygon blockchain, which is an evolving technology
          and subject to its own set of risks and challenges. Other blockchain networks might be added over time. Please
          do your own due diligence in regards to those and blockchain technology in general before making use of our
          Products.
        </p>
        <h2 className='text-2xl font-bold py-2'>E. Disclaimer</h2>
        <p className='pb-4'>
          By using our Products, you acknowledge and accept that the Product(s) (i) may contain bugs, errors and
          defects, (ii) may function improperly or be subject to periods of downtime and unavailability, (iii) may
          result in total or partial loss or corruption of data used in the Product(s), and (iv) may be modified at any
          time, including through the release of subsequent versions/updates/upgrades or alike, all with or without
          notice. We do not accept responsibility for any loss or damages, including but not limited to financial
          losses, arising from your use of our Products.
        </p>
        <p className='pb-4'>
          The <span className='font-bold'>Interface</span> to our Products is provided without any guarantees or
          warranties, whether express or implied, and is subject to availability. We do not make any representations or
          warranties regarding the accuracy, completeness, reliability, or security of the Interface. Your use of the
          Interface is entirely at your own risk. We do not guarantee that your access to the Interface will be
          uninterrupted, timely, or error-free, nor do we assume any responsibility for any harmful elements or viruses
          that may affect your use of the Interface. Any advice or information provided by us does not create any
          warranty concerning the Interface. We do not endorse or guarantee any statements, advertisements, or offers
          made by third parties regarding the Interface. To the fullest extent possible our liability is limited to the
          minimum extent permitted by any applicable law.
        </p>
        <p className='pb-4'>
          The <span className='font-bold'>Protocol</span> is provided without any warranties and is used at your own
          risk. We and other developers involved in creating the Protocol will not be held liable for any damages,
          claims, or losses arising from your use, inability to use, or interactions with other users of the Protocol,
          including but not limited to direct, indirect, incidental, special, exemplary, punitive, or consequential
          damages, or loss of cryptocurrencies, tokens, profits, or other valuable items. We do not endorse, guarantee,
          or take responsibility for any statements, advertisements, or offers made by third parties regarding the
          Protocol. To the fullest extent possible our liability is limited to the minimum extent permitted by any
          applicable law.
        </p>
        <p className='pb-4'>
          Furthermore all materials, documentation, additional information provided on our website/platform are also
          provided AS IS. OpenQ does not make any representations/warranties/guarantees concerning the accuracy or
          reliability of the use of these materials. To the fullest extent possible our liability is limited to the
          minimum extent permitted by any applicable law.
        </p>
        <p className='pb-4'>
          We do not provide financial or legal advice. Nothing in these Terms can be construed as such. If our website
          provides professional information (for example, legal, or financial), such information is for informational
          purposes only and should not be construed as professional advice. No action should be taken based upon any
          information contained in our website. You should seek independent professional advice from a person who is
          licensed and/or qualified in the applicable area. In particular, the content and materials available on our
          website do not constitute any form of advice or recommendation by us, should not be regarded as an offer,
          solicitation, invitation or recommendation to buy or sell investments, securities or any other financial
          services and is not intended to be relied upon by you in making any specific investment or other decision.
        </p>
        <h2 className='text-2xl font-bold py-2'>F. Limitation of Liability</h2>
        <p className='pb-4'>
          You acknowledge and agree that you assume full responsibility for your use of our Products. You acknowledge
          and agree that any information you send or receive during your use of our Products may not be secure and may
          be intercepted or later acquired by unauthorized parties. You acknowledge and agree that your use of our
          website and Products is at your own risk. Recognizing such, you underand and agree that, to the fulles extend
          permitted by applicable law, neither OpenQ nor its parents, subsidiaries, affiliates and agencies, as well as
          the officers, directors, employees shareholders or representatives, or its suppliers or licensors will be
          liable to your for any direct, indirect, incidental, special, consequential, punitive, exemplary or other
          damages on any kind, including without limitation damages for the loss of profits, goodwill, use, data or
          other tangible oder intangible losses or any other damages based on contract, tort (including, in
          jurisdictions where permitted, negligence amd gross negligence), strict liability or any other theory (even if
          OpenQ had been advised of the possibility of such damages) resulting from the Products, the use or the
          inability to use our Products, unauthorized access to or alteration of your transmissions or data, statements
          or conduct of any third party on the website or Products, any action we take or fail to take as a result of
          communications you send to us, human errors, technical malfunctions, failoures, including public utility or
          telephone outages, omissions, interruptions, latency, deletions or defects of any device or network,
          provideder, or software (includingm, but not limited to, those that do not permit participation in the
          Products), any injury or damage to computer equiopment, inability to fully access our website or Products,
          theft, tampering, destruction, or unauthorized access to, images or other content of any kind, data that is
          processed late or incorrectly or is incomplete or lost, typographical, printing or other errors, or any
          combination thereof, or any other matter relating to our website or Products.{' '}
        </p>
        <p className='pb-4'>
          As stated above, OpenQ is not a party to the contractual relationship between the Customer(s) and
          Developer(s). Therefore you hereby release OpenQ, our affiliates, and our respective officers, directors,
          agents, subsidiaries, joint ventures, and employees from claims, demands, and damages (actual and
          consequential) of every kind and nature, known and unknown, arising out of or in any way connected with any
          dispute that might arise within the contractual relationship you have as a Customer with a Developer or vice
          versa, whether it be at law or in equity.
        </p>
        <p className='pb-4'>
          OpenQ has not reviewed all of the websites linked on its website and is not responsible for the contents of
          any such linked website(s). The presence of any link on our website does not imply endorsement by OpenQ of the
          website's service, products, views or anything which is displayed on this external website. The use of any
          link provided on our website is at your own risk. To the fullest extent possible our liability is limited to
          the minimum extent permitted by any applicable law.
        </p>
        <p className='pb-4'>
          To the fullest extent legally possible under applicable law you hereby waive any and all legal protections
          which contradicts these Terms and our Agreement.
        </p>
        <h2 className='text-2xl font-bold py-2'>G. Indemnity</h2>
        <p className='pb-4'>
          You agree, to the fullest extent permitted by applicable law, to release and to indemnify, defend and hold
          harmless OpenQ and its parents, subsidiaries, affiliates and agencies, as well as the officers, directors,
          employees, shareholders and representatives, from and against any and all losses, liabilities, expenses,
          damages, costs (including attorneys’ fees and court costs) claims or actions of any kind whatsoever arising or
          resulting from: (i) your use of our Products, (ii) your violation of these Terms, (iii) any of your acts or
          omissions that implicate publicity rights, defamation, invasion of privacy, confidentiality, intellectual
          property rights or other property rights, (iv) any misrepresentation by you and (f) any disputes or issues
          between you as Customer and your contractual relationship with a Developer or visa versa.
        </p>
        <p className='pb-4'>
          OpenQ reserves the right, at its own expense, to assume exclusive defense and control of any matter otherwise
          subject to indemnification by you and, in such case, you agree to cooperate with OpenQ in the defense of such
          matter.
        </p>
        <h2 className='text-2xl font-bold py-2'>H. Intellectual Property</h2>
        <h2 className='text-xl font-bold py-2'>I. Copyright </h2>
        <p className='pb-4'>
          All materials on our website, including, without limitation, software, images, text, graphics, illustrations,
          logos, patents, trademarks, service marks, copyrights, photographs, audio, videos, music, and other content of
          any kind or form (hereinafter referred to as “Materials”) are the exclusive property of OpenQ. Except as
          explicitly permitted differently in this sections (H.), nothing in this Agreement shall be deemed to create a
          license in or under any such intellectual property rights, and you agree not to sell, license, rent, modify,
          distribute, copy, reproduce, transmit, publicly display, publicly perform, publish, adapt, edit or create
          derivative works from any of OpenQs materials.
        </p>
        <h2 className='text-xl font-bold py-2'>II. License</h2>
        <p className='pb-4'>
          As of now we are not providing any commercial or non-commercial license to our code. In case you would like to
          get a license in this regard, please reach out to info@openq.dev.
        </p>
        <h2 className='text-2xl font-bold py-2'>I. Termination and Suspension</h2>
        <p className='pb-4'>
          OpenQ may terminate or suspend all or part of the Product(s) without prior notice or liability if you breach
          any of the Terms of the Agreement. We may, in our sole discretion and without liability to you, with or
          without prior notice and at any time, modify or discontinue, temporarily or permanently, any portion of our
          Product(s).
        </p>
        <p className='pb-4'>
          The following provisions of the Terms survive any termination of these Terms: Disclaimer, Limitation of
          Liability, Indemnity and Miscellaneous.
        </p>
        <h2 className='text-2xl font-bold py-2'>J. Miscellaneous</h2>
        <h2 className='text-xl font-bold py-2'>I. Entire Agreement</h2>
        <p className='pb-4'>
          These Terms constitute the entire Agreement between you and OpenQ with respect to the Products and supersedes
          any prior agreements, oral or written, between you and OpenQ.
        </p>
        <h2 className='text-xl font-bold py-2'>II. Waiver and Severability of Terms</h2>
        <p className='pb-4'>
          The failure of OpenQ to exercise or enforce any right or provision of the Terms shall not constitute a waiver
          of such right or provision. If any provision of the Terms is found by an arbitrator or court of competent
          jurisdiction to be invalid, the parties nevertheless agree that the arbitrator or court should endeavor to
          give effect to the parties' intentions as reflected in the provision, and the other provisions of the Terms
          remain in full force and effect.
        </p>
        <h2 className='text-xl font-bold py-2'>III. Class Action Waiver</h2>
        <p className='pb-4'>
          The parties agree that any arbitration or other permitted action shall be conducted in their individual
          capacities only and not as a class action or other representative action, and the parties expressly waive
          their right to file a class action or seek relief on a class basis. You and OpenQ agree that each may bring
          claims against the other party only in your or its individual capacity, and not as a plaintiff or class member
          in any purported class or representative proceeding. If any court or arbitrator determines that the class
          action waiver set forth in this paragraph is void or unenforceable for any reason or that an arbitration can
          proceed on a class basis, then the arbitration provision which theoretically be possible to apply on the sole
          discretion of the parties, will be not applied.
        </p>
        <h2 className='text-xl font-bold py-2'>IV. International Users</h2>
        <p className='pb-4'>
          Our website and Products are controlled, operated and administered by OpenQ from its offices within Germany
          and is not intended to subject OpenQ to the laws or jurisdiction of any state, country or territory other than
          Germany. OpenQ does not represent or warrant that the website or any part thereof is appropriate or available
          for use in any particular jurisdiction other than Germany. Those who choose to access our website and make use
          of our Products do so on their own initiative and at their own risk, and are responsible for complying with
          all local statutes, orders, regulations, rules, and other laws. OpenQ may limit the website’s availability, in
          whole or in part, to any person, geographic area or jurisdiction we choose, at any time and in our sole
          discretion.
        </p>
        <h2 className='text-xl font-bold py-2'>V. Modifications of these Terms </h2>
        <p className='pb-4'>
          Due to the fast pace not only of technological developments but also from a regulatory side, we may, at our
          sole discretion, amend or update, in whole or in part these Terms, without any obligation to notify you in
          advance. We recommend that you visit this page regularly to be informed of any changes. Your continued use of
          our Products after any changes and updates will constitute your consent to such changes and updates.
        </p>
        <h2 className='text-xl font-bold py-2'>VI. Governing LawS</h2>
        <p className='pb-4'>
          Any claim related to OpenQs Website shall be governed exclusively by the laws of Germany excluding the
          conflict of laws principles thereof.
        </p>
        <p className='pb-4'>
          Any dispute arising out of or in connection with these Terms shall be submitted to the exclusive jurisdiction
          of the competent courts of the city of Berlin, Germany.
        </p>
      </div>
    </div>
  );
};

export default TermsOfUse;
