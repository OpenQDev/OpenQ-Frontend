import React, { useContext, useState } from 'react';
import StoreContext from '../../../../store/Store/StoreContext';
import Link from 'next/link';
import axios from 'axios';
import { MailIcon } from '@primer/octicons-react';
import LoadingIcon from '../../../Loading/ButtonLoadingIcon';
import {
  EMAIL_NOT_SENT,
  EMAIL_SENT,
  NOT_INVOICEABLE,
  NO_DEPOSITS,
  MISSING_FIELDS_CLIENT,
  MISSING_FIELDS_FREELANCER,
  INVALID_EMAIL_CLIENT,
  INVALID_EMAIL_FREELANCER,
} from '../../../../constants/invoiceableResponses';
import useWeb3 from '../../../../hooks/useWeb3';

const Invoicing = ({ bounty, setClaimable }) => {
  const [loading, setLoading] = useState(false);
  const [appState] = useContext(StoreContext);
  const { account } = useWeb3();
  const { accountData } = appState;
  const profileLink = `${process.env.NEXT_PUBLIC_BASE_URL}/user/${accountData.id}?tab=Invoicing (Freelancer)`;

  const [invoiceResponse, setInvoiceResponse] = useState('');
  const handleResult = (result) => {
    if (result.data) {
      setInvoiceResponse(result.data.message);
      if (result.data.message === EMAIL_SENT) {
        setClaimable((prev) => ({ ...prev, invoice: true }));
      }
    } else if (result.data.message) setInvoiceResponse(result.data.message);
    else setInvoiceResponse(EMAIL_NOT_SENT);
    setLoading(false);
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
    [MISSING_FIELDS_FREELANCER]: {
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
    [MISSING_FIELDS_CLIENT]: {
      MessageHTML: () => (
        <>
          The organization hasn't added all the mandatory fields in their invoice details.{' '}
          {invoiceResponse?.invoicingEmail ? `Please contact them at ${invoiceResponse.invoicingEmail} or` : 'Please'}{' '}
          ask for help in our{' '}
          <a target={'_blank'} className='underline' href='https://discord.gg/puQVqEvVXn' rel='noreferrer'>
            discord
          </a>
          .
        </>
      ),
    },
    [INVALID_EMAIL_CLIENT]: {
      status: 'invalidEmail',
      MessageHTML: () => (
        <>
          The organization's invoicing email is invalid.
          {invoiceResponse?.invoicingEmail && `The email entered was  ${invoiceResponse.invoicingEmail}.`} Please
          contact them or ask for help in our{' '}
          <a target={'_blank'} className='underline' href='https://discord.gg/puQVqEvVXn' rel='noreferrer'>
            discord
          </a>
          .
        </>
      ),
    },
    [INVALID_EMAIL_FREELANCER]: {
      MessageHTML: () => (
        <>
          Your email is an invalid format. Please head to your{' '}
          <Link className='underline' href={profileLink}>
            profile
          </Link>{' '}
          and correct it or ask for help in our{' '}
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

  const getInvoiceSent = (bounty) => {
    if (bounty.bountyType === '3' || bounty.bountyType === '2') {
      const currentTier = bounty.tierWinners.indexOf(accountData.github);
      return bounty.invoiceCompleted?.[currentTier];
    } else return bounty.invoiceCompleted?.[0];
  };
  const invoiceSentPreviously = getInvoiceSent(bounty);
  const successInvoice = invoiceResponseOptions[invoiceResponse]?.successInvoice || invoiceSentPreviously;
  const MessageHTML = invoiceResponseOptions[invoiceResponse]?.MessageHTML || (() => <></>);

  const handleSendInvoice = async () => {
    if (bounty.bountyType === '3') {
      setLoading(true);
      try {
        const result = await axios.post(
          `${process.env.NEXT_PUBLIC_INVOICE_URL}/fixedcontest?id=${bounty.bountyAddress}&account=${account}`,
          {},
          { withCredentials: true }
        );
        handleResult(result);
      } catch (err) {
        setLoading(false);
        setInvoiceResponse(EMAIL_NOT_SENT);
      }
    } else if (bounty.bountyType === '0') {
      try {
        const result = await axios.post(
          `${process.env.NEXT_PUBLIC_INVOICE_URL}/single?id=${bounty.bountyAddress}&account=${account}`,
          {},
          { withCredentials: true }
        );
        handleResult(result);
      } catch (err) {
        setLoading(false);
        setInvoiceResponse(EMAIL_NOT_SENT);
      }
    }
  };

  const accountKeys = [
    'company',
    'billingName',
    'city',
    'streetAddress',
    'postalCode',
    'country',
    'phoneNumber',
    'province',
    'invoicingEmail',
    'invoiceNumber',
    'taxId',
    'vatNumber',
    'vatRate',
  ];
  const neededAccountData = accountKeys.filter((key) => {
    return !accountData[key];
  });
  const needsAccountData = neededAccountData.length > 0;

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
            <div className='font-semibold flex gap-2'>
              Step 1{' '}
              <>
                {!needsAccountData && !successInvoice && (
                  <div className='border border-green bg-green-inside border-2 text-sm px-2 rounded-full h-6'>
                    Completed
                  </div>
                )}
              </>
            </div>
            <p>
              Please fill in your billing details in your{' '}
              <Link
                className='text-link-colour hover:underline col-span-2'
                href={profileLink}
                target='_blank'
                rel='noopener norefferer'
              >
                profile
              </Link>{' '}
              and review the sample invoice.
            </p>
            {bounty.creatingUser && (
              <p>
                To set the right VAT rate, note that the bounty sponsor's country is: {bounty.creatingUser?.country}
              </p>
            )}
          </div>
          <div>
            <p className='font-semibold'>Step 2</p>
            <p>Send your invoice to complete this requirement.</p>
          </div>
          <button onClick={handleSendInvoice} className='flex items-center gap-2 btn-requirements w-fit'>
            <MailIcon />
            Send {successInvoice && 'again'}
            {loading && <LoadingIcon />}
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
