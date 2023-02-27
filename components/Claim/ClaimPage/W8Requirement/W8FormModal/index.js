import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import ModalLarge from '../../../../Utils/ModalLarge';

const index = ({ setShowModal }) => {
  const btn = (
    <button className='btn-primary' onClick={() => setShowModal(false)}>
      I understand
    </button>
  );
  return (
    <ModalLarge title={'W8/W9 Form'} footerRight={btn} setShowModal={setShowModal} resetState={setShowModal}>
      <div className='whitespace-pre-wrap px-8 py-2'>
        <p className='py-2'>
          Please complete and upload a form W-8. Choose one of five types, depending on your entity. We encourage you to
          consult with your own tax or financial adviser to determine which form is appropriate for you.
        </p>

        <br />

        <p className='flex py-2 gap-2'>
          1.
          <Image src={'/diverse/us-flag.jpg'} width={24} height={24} />
          W-9
        </p>

        <p className='py-2'>✅ US Citizen or Resident</p>

        <p className='py-2'>✅ Claiming as an individual</p>

        <p className='py-2'>
          Instructions:{' '}
          <Link
            href={'https://www.irs.gov/forms-pubs/about-form-w-9'}
            rel='noopener norefferer'
            target='_blank'
            className='text-link-colour hover:underline col-span-2'
          >
            https://www.irs.gov/forms-pubs/about-form-w-9
          </Link>
        </p>

        <p className='py-2'>
          Form:{' '}
          <Link
            href={'https://www.irs.gov/pub/irs-pdf/fw9.pdf'}
            rel='noopener norefferer'
            target='_blank'
            className='text-link-colour hover:underline col-span-2'
          >
            https://www.irs.gov/pub/irs-pdf/fw9.pdf
          </Link>
        </p>

        <br />

        <p className='py-2'>2. 🌍 W-8-BEN</p>

        <p className='py-2'>✅ Not a US Citizen or Resident</p>

        <p className='py-2'>✅ Claiming as an individual</p>

        <p className='py-2'>
          Instructions:{' '}
          <Link
            href={'https://www.irs.gov/instructions/iw8ben'}
            rel='noopener norefferer'
            target='_blank'
            className='text-link-colour hover:underline col-span-2'
          >
            https://www.irs.gov/instructions/iw8ben
          </Link>
        </p>

        <p className='py-2'>
          Form:{' '}
          <Link
            href={'https://www.irs.gov/pub/irs-pdf/fw8ben.pdf'}
            rel='noopener norefferer'
            target='_blank'
            className='text-link-colour hover:underline col-span-2'
          >
            https://www.irs.gov/pub/irs-pdf/fw8ben.pdf
          </Link>
        </p>

        <br />

        <p className='py-2'>3. 🌎 W-8-BEN-E</p>

        <p className='py-2'>✅ Not a US Citizen or Resident</p>

        <p className='py-2'>✅ Claiming as an entity</p>

        <p className='py-2'>
          Instructions:{' '}
          <Link
            href={'https://www.irs.gov/instructions/iw8bene'}
            rel='noopener norefferer'
            target='_blank'
            className='text-link-colour hover:underline col-span-2'
          >
            https://www.irs.gov/instructions/iw8bene
          </Link>
        </p>

        <p className='py-2'>
          Form:{' '}
          <Link
            href={'https://www.irs.gov/pub/irs-pdf/fw8bene.pdf'}
            rel='noopener norefferer'
            target='_blank'
            className='text-link-colour hover:underline col-span-2'
          >
            https://www.irs.gov/pub/irs-pdf/fw8bene.pdf
          </Link>
        </p>

        <br />

        <p className='py-2'>4. 🌎 W-8-ECI</p>

        <p className='py-2'>✅ Not a US Citizen or Resident</p>

        <p className='py-2'>
          ✅ Foreign Person’s Claim That Income is Effectively Connected With the Conduct of a Trade or Business in the
          United States
        </p>

        <p className='py-2'>
          Instructions:{' '}
          <Link
            href={'https://www.irs.gov/pub/irs-pdf/iw8eci.pdf'}
            rel='noopener norefferer'
            target='_blank'
            className='text-link-colour hover:underline col-span-2'
          >
            https://www.irs.gov/pub/irs-pdf/iw8eci.pdf
          </Link>
        </p>

        <p className='py-2'>
          Form:{' '}
          <Link
            href={'https://www.irs.gov/pub/irs-pdf/fw8eci.pdf'}
            rel='noopener norefferer'
            target='_blank'
            className='text-link-colour hover:underline col-span-2'
          >
            https://www.irs.gov/pub/irs-pdf/fw8eci.pdf
          </Link>
        </p>

        <br />

        <p className='py-2'>5. 🌎 W-8-EXP</p>

        <p className='py-2'>✅ Not a US Citizen or Resident</p>

        <p className='py-2'>✅ Foreign Government or Other Foreign Organization</p>

        <p className='py-2'>
          Instructions:{' '}
          <Link
            href={'https://www.irs.gov/pub/irs-pdf/iw8exp.pdf'}
            rel='noopener norefferer'
            target='_blank'
            className='text-link-colour hover:underline col-span-2'
          >
            https://www.irs.gov/pub/irs-pdf/iw8exp.pdf
          </Link>
        </p>

        <p className='py-2'>
          Form:{' '}
          <Link
            href={'https://www.irs.gov/pub/irs-pdf/fw8exp.pdf'}
            rel='noopener norefferer'
            target='_blank'
            className='text-link-colour hover:underline col-span-2'
          >
            https://www.irs.gov/pub/irs-pdf/fw8exp.pdf
          </Link>
        </p>

        <br />

        <p className='py-2'>6. 🌎 W-8-IMY</p>

        <p className='py-2'>✅ Not a US Citizen or Resident</p>

        <p className='py-2'>✅ Foreign Intermediary, Foreign Flow-Through Entity, or Certain U.S. Branches</p>

        <p className='py-2'>
          Instructions:{' '}
          <Link
            href={'https://www.irs.gov/individuals/international-taxpayers/form-w-8imy'}
            rel='noopener norefferer'
            target='_blank'
            className='text-link-colour hover:underline col-span-2'
          >
            https://www.irs.gov/individuals/international-taxpayers/form-w-8imy
          </Link>
        </p>

        <p className='py-2'>
          Form:{' '}
          <Link
            href={'https://www.irs.gov/pub/irs-pdf/fw8imy.pdf'}
            rel='noopener norefferer'
            target='_blank'
            className='text-link-colour hover:underline col-span-2'
          >
            https://www.irs.gov/pub/irs-pdf/fw8imy.pdf
          </Link>
        </p>

        <br />

        <p className='py-2'>
          The IRS requires us to withhold FIL from payments to non-U.S. citizens who live outside of the United States
          unless we can associate the payee with a completed, signed W-8/W-9 form.
        </p>
      </div>
    </ModalLarge>
  );
};

export default index;
