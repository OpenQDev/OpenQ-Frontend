import React, { useState, useContext } from 'react';
import Link from 'next/link';
import { UploadIcon } from '@primer/octicons-react';
import W8FormModal from './W8FormModal';
import axios from 'axios';
import { EMAIL_NOT_SENT } from '../../../../constants/invoiceableResponses';
import StoreContext from '../../../../store/Store/StoreContext';
import { getW8Approved } from '../../../../services/utils/lib';
const W8Form = ({ bounty }) => {
  const [appState] = useContext(StoreContext);
  const [file, setFile] = useState(null);
  const [invoiceResponse, setInvoiceResponse] = useState('');
  const [sent, setSent] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { accountData } = appState;

  const W8Approved = getW8Approved(bounty, accountData);
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setSent(false);
    setInvoiceResponse('');
  };

  const handleResult = (result) => {
    if (result?.data?.message) {
      setInvoiceResponse(result.data.message);
    } else setInvoiceResponse(EMAIL_NOT_SENT);
  };
  const handleSend = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    setSent(true);
    formData.append('file', file);
    setFile(null);
    const result = await axios.post(
      `${process.env.NEXT_PUBLIC_INVOICE_URL}/taxform?id=${bounty.bountyAddress}`,
      formData,
      {
        withCredentials: true,
        headers: {
          'content-type': 'multipart/form-data',
        },
      }
    );

    handleResult(result);
  };

  const invoiceResponseOptions = {
    '': {
      MessageHTML: () => <></>,
    },

    EMAIL_SENT: {
      successInvoice: true,
      MessageHTML: () => (
        <>
          We have sent your tax document to the organization. Please wait until they have viewed and confirmed them. If
          they request changes, you will be notified via your contact email. If you have any questions, feel free to
          reach out in our{' '}
          <a target={'_blank'} className='underline' href='https://discord.gg/puQVqEvVXn' rel='noreferrer'>
            discord
          </a>
        </>
      ),
    },
    NO_DEPOSITS: { MessageHTML: () => "This bounty isn't invoiceable." },
    'no deposits': {
      MessageHTML: () =>
        "Funder hasn't made any deposits yet, please wait for money to be deposited before sending invoice.",
    },

    NOT_WINNER: {
      MessageHTML: () => (
        <>
          You are not the winner of this bounty
          <br />
          <br />
          If you believe this is an error, please reach out to us via{' '}
          <a target={'_blank'} className='underline' href='https://discord.gg/puQVqEvVXn' rel='noreferrer'>
            discord
          </a>
        </>
      ),
    },

    SECURITY_ERROR: {
      MessageHTML: () => (
        <>
          Your pdf failed our security scan, please reach out to us via{' '}
          <a target={'_blank'} className='underline' href='https://discord.gg/puQVqEvVXn' rel='noreferrer'>
            discord
          </a>
        </>
      ),
    },

    NOT_PDF: {
      MessageHTML: () => <>Your file is not a pdf.</>,
    },
    EMAIL_NOT_SENT: {
      MessageHTML: () => (
        <>
          We are very sorry but it seems we are having difficulties with our email server, please try again or ask for
          support on our{' '}
          <a target={'_blank'} className='underline' href='https://discord.gg/puQVqEvVXn' rel='noreferrer'>
            discord
          </a>
          .
        </>
      ),
    },
    EMAIL_LIMIT_REACHED: {
      MessageHTML: () => (
        <>
          You have reached the limit of 4 emails per day, please try again tomorrow or ask for support on our{' '}
          <a target={'_blank'} className='underline' href='https://discord.gg/puQVqEvVXn' rel='noreferrer'>
            discord
          </a>
          .
        </>
      ),
    },
  };

  const MessageHTML = invoiceResponseOptions[invoiceResponse]?.MessageHTML || (() => <></>);
  return (
    <section className='flex flex-col gap-3'>
      <h4 className='text-2xl flex content-center items-center gap-2 border-b border-gray-700 pb-2'>
        Form W8/W9*
        <div
          className={`${
            W8Approved ? 'border-green bg-green-inside' : 'bg-info border-2 border-info-strong'
          } text-sm px-2 border rounded-full h-6`}
        >
          {W8Approved ? 'Approved' : 'Required'}
        </div>
      </h4>
      {W8Approved && <div className='border-green bg-green-inside border p-4 rounded-sm'> Your w8 was accepted</div>}{' '}
      <div>
        Please complete and upload a form W-8. Choose one of five types, depending on your entity. We encourage you to
        consult with you own tax or financial adviser to determine which form is appropriate for you or ask in our
        <div>
          <Link
            href={'https://discord.gg/puQVqEvVXn'}
            rel='noopener norefferer'
            target='_blank'
            className='text-blue-500 hover:underline col-span-2'
          >
            discord
          </Link>{' '}
          for help.
        </div>
      </div>
      <div className='font-semibold flex gap-2 group w-fit'>
        Upload{' '}
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          width='24'
          height='24'
          className='fill-primary cursor-pointer'
          onClick={() => setShowModal(true)}
        >
          <path d='M13 7.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-3 3.75a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v4.25h.75a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1 0-1.5h.75V12h-.75a.75.75 0 0 1-.75-.75Z'></path>
          <path d='M12 1c6.075 0 11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1ZM2.5 12a9.5 9.5 0 0 0 9.5 9.5 9.5 9.5 0 0 0 9.5-9.5A9.5 9.5 0 0 0 12 2.5 9.5 9.5 0 0 0 2.5 12Z'></path>
        </svg>
      </div>
      <form onSubmit={handleSend} className='flex gap-2'>
        <label htmlFor='file input' className='relative btn-requirements cursor-pointer'>
          <div className='flex gap-2 z-20 items-center'>
            <UploadIcon size={16} /> Upload
          </div>
          <input
            onChange={handleFileChange}
            type='file'
            className='absolute invisible w-full top-0 bottom-0 z-10'
            id='file input'
          />
        </label>
        <div className='border border-web-gray w-full font-semibold px-2 rounded-sm'>{file?.name}</div>
        <button
          disabled={!file}
          className={file ? 'btn-requirements cursor-pointer' : 'btn-default cursor-not-allowed'}
        >
          {sent ? 'Sent' : 'Send'}
        </button>
      </form>
      <div className=''>
        *W-8 forms are{' '}
        <Link
          href={'https://www.irs.gov/'}
          rel='noopener norefferer'
          target='_blank'
          className='text-blue-500 hover:underline col-span-2'
        >
          Internal Revenue Service
        </Link>{' '}
        (IRS) forms that foreign individuals and businesses must file to verify their country of residence for tax
        purposes, certifying that they qualify for a lower rate of tax withholding.
      </div>
      {invoiceResponse && (
        <div className='bg-info border-info-strong border p-4 rounded-sm'>
          <MessageHTML />
        </div>
      )}
      {showModal && <W8FormModal setShowModal={setShowModal} />}
    </section>
  );
};

export default W8Form;
