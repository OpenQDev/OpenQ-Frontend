import React, { useContext, useState } from 'react';
import StoreContext from '../../../store/Store/StoreContext';
import Link from 'next/link';
import axios from 'axios';
import { MailIcon } from '@primer/octicons-react';
import {
  EMAIL_NOT_SENT,
  EMAIL_SENT,
  NOT_INVOICEABLE,
  NO_DEPOSITS,
  MISSING_FIELDS,
} from '../../../constants/invoiceableResponses';

const Invoicing = ({ bounty }) => {
  const [appState] = useContext(StoreContext);
  const { account } = appState;
  const { accountData } = appState;
  const profileLink = `${process.env.NEXT_PUBLIC_BASE_URL}/user/${accountData.id}`;

  const [invoiceResponse, setInvoiceResponse] = useState('');
  const handleResult = (result) => {
    if (result.data) {
      setInvoiceResponse(result.data.message);
    } else setInvoiceResponse(EMAIL_NOT_SENT);
  };
  const invoiceResponseOptions = {
    '': {
      MessageHTML: () => <></>,
    },
    [EMAIL_SENT]: {
      successInvoice: true,
      MessageHTML: () => <></>,
    },
    [NOT_INVOICEABLE]: { MessageHTML: () => "This bounty isn't invoiceable." },
    [NO_DEPOSITS]: {
      MessageHTML: () =>
        "Funder hasn't made any deposits yet, please wait for money to be deposited before sending invoice.",
    },
    [MISSING_FIELDS]: {
      MessageHTML: () => (
        <>
          You haven't added all the mandatory fields in your invoice details. Please head to your{' '}
          <Link className='underline' href={profileLink}>
            profile
          </Link>{' '}
          and add them or ask for help in our{' '}
          <a target={'_blank'} className='underline' href='https://discord.gg/puQVqEvVXn' rel='noreferrer'>
            discord
          </a>
          .
        </>
      ),
    },
    [EMAIL_NOT_SENT]: {
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
  };
  const successInvoice = invoiceResponseOptions[invoiceResponse]?.successInvoice;
  const MessageHTML = invoiceResponseOptions[invoiceResponse]?.MessageHTML || (() => <></>);

  const handleSendInvoice = async () => {
    try {
      const result = await axios.post(
        `${process.env.NEXT_PUBLIC_INVOICE_URL}/fixedcontest?id=${bounty.bountyAddress}&account=${account}`,
        {},
        { withCredentials: true }
      );

      handleResult(result);
    } catch (err) {
      if (JSON.parse(err.request.response).missingFields.length) {
        setInvoiceResponse(MISSING_FIELDS);
      } else {
        setInvoiceResponse(EMAIL_NOT_SENT);
      }
    }
  };

  return (
    <>
      {bounty.invoiceRequired && (
        <section className='flex flex-col gap-3'>
          <h4 className='text-2xl flex content-center items-center gap-2 border-b border-gray-700 pb-2'>
            Invoice
            <div
              className={`${
                successInvoice ? 'border-green bg-green-inside' : 'bg-info border-info-strong'
              } border-2 text-sm px-2 rounded-full h-6`}
            >
              {successInvoice ? 'Approved' : 'Required'}
            </div>
          </h4>
          <p className='font-semibold'>How to use OpenQ's Invoice Generator</p>
          <div>
            {' '}
            <p className='font-semibold'>Step 1</p>
            <p>
              Please fill in your billing details in your{' '}
              <Link className='text-blue-500 hover:underline col-span-2' href={profileLink}>
                profile
              </Link>{' '}
              and review the sample invoice.
            </p>
          </div>
          <div>
            <p className='font-semibold'>Step 2</p>
            <p>Send your invoice to complete this requirement.</p>
          </div>
          <button onClick={handleSendInvoice} className='flex items-center gap-2 btn-requirements w-fit'>
            <MailIcon />
            Send {successInvoice && 'again'}
          </button>
          {!successInvoice && invoiceResponse && (
            <div className='bg-info border-info-strong border p-4 rounded-sm'>
              <MessageHTML />
            </div>
          )}
        </section>
      )}
    </>
  );
};
export default Invoicing;
