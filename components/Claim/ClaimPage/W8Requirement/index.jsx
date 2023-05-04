import React, { useState, useContext, useEffect } from 'react';
import Link from 'next/link';
import { CheckIcon, UploadIcon } from '@primer/octicons-react';
import W8FormModal from './W8FormModal';
import axios from 'axios';
import {
  EMAIL_NOT_SENT,
  INVALID_EMAIL_CLIENT,
  INVALID_EMAIL_FREELANCER,
} from '../../../../constants/invoiceableResponses';
import StoreContext from '../../../../store/Store/StoreContext';
import { getW8Approved } from '../../../../services/utils/lib';
import LoadingIcon from '../../../Loading/ButtonLoadingIcon';
import FreelancerDetails from '../../../User/InvoicingDetailsTab/FreelancerDetails';
import ModalDefault from '../../../Utils/ModalDefault';
const W8Requirement = ({ bounty }) => {
  const [loading, setLoading] = useState(false);
  const [appState] = useContext(StoreContext);
  const [file, setFile] = useState(null);
  const [w8formResponse, setW8FormResponse] = useState('');
  const [showModal, setShowModal] = useState(false);
  const { accountData } = appState;
  const pending = bounty.requests?.nodes.some((node) => node.requestingUser.id === accountData.id);
  const [sent, setSent] = useState(pending);
  const profileLink = `${process.env.NEXT_PUBLIC_BASE_URL}/user/${accountData.id}?tab=Invoicing (Freelancer)`;
  const [w8Approved, setW8Approved] = useState(false);
  const [showTaxModal, setShowTaxModal] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [compliance, setCompliance] = useState({ signed: null, dated: null, relevant: null });

  const noEmail = !accountData?.invoicingEmail;
  useEffect(() => {
    const W8Approved = getW8Approved(bounty, accountData);
    setW8Approved(W8Approved);

    const getPrivateRequest = async () => {
      const request = bounty.requests?.nodes?.find((node) => node.requestingUser.id === accountData.id);

      if (request) {
        try {
          const privateRequest = await appState.openQPrismaClient.getPrivateRequest(request.id);
          setCurrentRequest(privateRequest?.message);
        } catch (e) {
          appState.logger.error(e);
        }
      }
    };
    getPrivateRequest();
  }, [bounty, accountData]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setSent(false);
    setW8FormResponse('');
  };

  const handleResult = (result) => {
    if (result?.data?.message) {
      setW8FormResponse(result.data.message);
    } else setW8FormResponse(EMAIL_NOT_SENT);

    setLoading(false);
  };
  const handleSend = async (e) => {
    e.preventDefault();
    setLoading(true);
    setW8FormResponse('LOADING');
    const formData = new FormData();
    setSent(true);
    formData.append('file', file);
    setFile(null);
    setCompliance({});
    setShowTaxModal();
    try {
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
    } catch (e) {
      setLoading(false);
      setW8FormResponse(EMAIL_NOT_SENT);
      appState.logger.error('w8form.js1', e);
    }
    e.target.reset();
  };

  const w8formResponseOptions = {
    '': {
      MessageHTML: () => <></>,
    },
    [INVALID_EMAIL_CLIENT]: {
      MessageHTML: () => (
        <>
          The organization's invoicing email is invalid.
          {w8formResponse?.invoicingEmail && `The email entered was  ${w8formResponse.invoicingEmail}.`} Please contact
          them or ask for help in our{' '}
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
    EMAIL_SENT: {
      successW8Form: true,
      MessageHTML: () => (
        <>
          We have sent your tax document to the organization. Please wait until they have viewed and confirmed them. If
          they request changes, you will be notified via your contact email. If you have any questions, feel free to
          reach out in our{' '}
          <a target={'_blank'} className='underline' href='https://discord.gg/puQVqEvVXn' rel='noreferrer'>
            Discord
          </a>
          .
        </>
      ),
    },
    NO_DEPOSITS: {
      MessageHTML: () =>
        "Funder hasn't made any deposits yet, please wait for money to be deposited before sending W8/W9 form.",
    },
    'no deposits': {
      MessageHTML: () =>
        "Funder hasn't made any deposits yet, please wait for money to be deposited before sending W8/W9 form.",
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
    FILE_TOO_LARGE: {
      MessageHTML: () => (
        <>
          Your pdf was too large, must be under 10 mb threshold. Please reach out to us via{' '}
          <a target={'_blank'} className='underline' href='https://discord.gg/puQVqEvVXn' rel='noreferrer'>
            discord
          </a>
          .
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
    LOADING: {
      MessageHTML: () => <>Scanning and sending your tax form to your client.</>,
    },
  };
  const isCompliant = compliance.dated && compliance.signed && compliance.relevant;
  const submitBtn = (
    <button
      disabled={!isCompliant}
      className={`flex gap-2 h-8 items-center justify-center text-center
    ${isCompliant ? 'btn-requirements cursor-pointer' : 'btn-default cursor-not-allowed'}
  `}
    >
      {sent ? (loading ? 'Sending' : 'Sent') : 'Send'}
      {loading && <LoadingIcon />}
    </button>
  );
  const updateCompliance = (e) => {
    const id = e.target.id;
    const value = e.target.checked;
    setCompliance((prev) => ({ ...prev, [id]: value }));
  };
  const openModal = (e) => {
    e.preventDefault();
    setShowTaxModal(true);
  };

  const MessageHTML = w8formResponseOptions[w8formResponse]?.MessageHTML || (() => <></>);
  return (
    <section className='flex flex-col gap-3'>
      <h4 className='text-2xl flex content-center items-center gap-2 border-b border-gray-700 pb-2'>
        Form W8/W9*
        <div
          className={`${
            w8Approved ? 'border-green bg-green-inside' : 'bg-info border-2 border-info-strong'
          } text-sm px-2 border rounded-full h-6`}
        >
          {w8Approved ? 'Approved' : 'Required'}
        </div>
      </h4>
      {w8Approved ? (
        <div className='border-green bg-green-inside border p-4 rounded-sm'> Your tax form was accepted</div>
      ) : (
        <>
          <div>
            {sent && (
              <div className='bg-blue-200 text-blue-900 border-blue-500 border p-4 px-4 my-2 rounded-sm'>
                Thank you for submitting your tax form. Kindly note that OpenQ is not involved in the reviewing process,
                which may take up to 19 days. We appreciate your patience and will notify you as soon as the process is
                complete.
              </div>
            )}
            {!w8Approved && currentRequest && (
              <div className='bg-info border-info-strong rounded-sm border p-4 my-4'>
                The organization has requested changes on the tax form you submitted. Please review the requested change
                below, update your tax forms, and re-upload them here.
                <br />
                <br />
                <br />
                <div className='flex gap-2 font-bold'>
                  Requested change: <div className='text-gray-400 font-normal'>{currentRequest}</div>
                </div>
              </div>
            )}
            <div>
              Please complete and upload a W-8/W-9 form (must be in PDF format). Choose one of five types, depending on
              your entity. We encourage you to consult with you own tax or financial adviser to determine which form is
              appropriate for you or ask in our
              <div>
                <Link
                  href={'https://discord.gg/puQVqEvVXn'}
                  rel='noopener norefferer'
                  target='_blank'
                  className='text-link-colour hover:underline col-span-2'
                >
                  discord
                </Link>{' '}
                for help.
              </div>
            </div>
            {noEmail && (
              <>
                <p>Please add an email to your profile so that we can send you a copy of the your submitted form.</p>
                <FreelancerDetails slim={true} emailOnly={true} />
              </>
            )}
          </div>
          <div>
            Explore our W8/W9 templates{' '}
            <button className='text-blue-500 hover:underline' onClick={() => setShowModal(true)}>
              here
            </button>
            .
          </div>
          <div>✅ PDF File must be less than 6 MB</div>
          <div>🔔 Don't forget to add your signature and date to your W8 or W9 Form!</div>
          <form onSubmit={handleSend} className='flex gap-2 items-center flex-wrap md:flex-nowrap'>
            {sent && (
              <div
                className={`relative flex w-fit whitespace-nowrap gap-2 h-8 items-center justify-center text-center btn-default-disabled cursor-not-allowed`}
              >
                Under Review
              </div>
            )}
            <label htmlFor='file input' className={`relative flex items-center`}>
              <div
                className={`relative flex w-fit whitespace-nowrap gap-2 h-8 items-center justify-center text-center ${
                  noEmail ? 'cursor-not-allowed' : 'cursor-pointer'
                } ${file || noEmail ? 'btn-primary' : 'btn-requirements'}`}
              >
                {file ? (
                  <>
                    <CheckIcon size={16} />
                    Change PDF File
                  </>
                ) : sent ? (
                  <>
                    <UploadIcon size={16} />
                    Upload Updated W8/W9 PDF
                  </>
                ) : (
                  <>
                    <UploadIcon size={16} />
                    Choose PDF File
                  </>
                )}
              </div>
              <input
                onChange={handleFileChange}
                disabled={loading || noEmail}
                type='file'
                className='absolute invisible w-full top-0 bottom-0 z-10'
                id='file input'
              />
            </label>
            <div className='border border-web-gray w-full flex items-center font-semibold h-8 px-2 rounded-sm'>
              {file?.name}
            </div>
            <button
              onClick={openModal}
              disabled={!file}
              className={`flex gap-2 h-8 items-center justify-center text-center
                ${file ? 'btn-requirements cursor-pointer' : 'btn-default cursor-not-allowed'}
              `}
            >
              {'Send'}
              {loading && <LoadingIcon />}
            </button>
            {showTaxModal && (
              <ModalDefault setShowModal={setShowTaxModal} title='Submit tax form' footerRight={submitBtn}>
                <div className='flex gap-2'>
                  <input
                    className='checkbox'
                    checked={compliance.signed}
                    id='signed'
                    type='checkbox'
                    onClick={updateCompliance}
                  />
                  <label htmlFor='signed'>I have properly signed my tax documents</label>
                </div>{' '}
                <div className='flex gap-2'>
                  <input
                    className='checkbox'
                    checked={compliance.dated}
                    id='dated'
                    type='checkbox'
                    onClick={updateCompliance}
                  />

                  <label htmlFor='dated'>I have properly dated my tax documents</label>
                </div>
                <div className='flex gap-2'>
                  <input
                    className='checkbox'
                    checked={compliance.relevant}
                    id='relevant'
                    type='checkbox'
                    onClick={updateCompliance}
                  />

                  <label htmlFor='relevant'>I have completed all relevant sections of my tax documents</label>
                </div>
              </ModalDefault>
            )}
          </form>
          <div className=''>
            *W-8 forms are{' '}
            <Link
              href={'https://www.irs.gov/'}
              rel='noopener norefferer'
              target='_blank'
              className='text-link-colour hover:underline col-span-2'
            >
              Internal Revenue Service
            </Link>{' '}
            (IRS) forms that foreign individuals and businesses must file to verify their country of residence for tax
            purposes, certifying that they qualify for a lower rate of tax withholding.
          </div>
        </>
      )}
      {w8formResponse && (
        <div className='bg-info border-info-strong border p-4 rounded-sm'>
          <MessageHTML />
        </div>
      )}
      {showModal && <W8FormModal setShowModal={setShowModal} />}
    </section>
  );
};

export default W8Requirement;
