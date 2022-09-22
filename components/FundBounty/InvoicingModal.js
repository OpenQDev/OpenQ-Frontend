import React, { useRef, useEffect, useContext, useState } from 'react';
import useWeb3 from '../../hooks/useWeb3';
import StoreContext from '../../store/Store/StoreContext';
import axios from 'axios';

const InvoicingModal = ({ closeModal, bounty }) => {
  const { account } = useWeb3();
  const [appState, dispatch] = useContext(StoreContext);
  const { logger, openQPrismaClient } = appState;
  const [success, setSucess] = useState();

  const signMessage = async () => {
    const message = 'OpenQ';
    const signature = await window.ethereum.request({
      method: 'personal_sign',
      params: [message, account],
    });
    return signature;
  };

  const handleForm = async (e) => {
    e.preventDefault();

    if (!account) {
      const payload = {
        type: 'CONNECT_WALLET',
        payload: true,
      };
      dispatch(payload);
      return;
    }
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_AUTH_URL}/hasSignature?address=${account}`, {
        withCredentials: true,
      });
      if (response.data.status === false) {
        const signature = await signMessage();
        await axios.post(
          `${process.env.NEXT_PUBLIC_AUTH_URL}/verifySignature`,
          {
            signature,
            address: account,
          },
          { withCredentials: true }
        );
      }
      const formValues = { address: account };
      const form = e.target;
      const interMediateValue = Object.values(form)
        .filter((input) => input.nodeName === 'INPUT' && input.type !== 'submit')
        .map((input) => {
          return { [input.id]: input.value };
        });
      interMediateValue.forEach((inputObj) => {
        for (let key in inputObj) {
          formValues[key] = inputObj[key];
        }
      });
      const { updateUser } = await openQPrismaClient.setFunderValues(formValues);
      if (updateUser) {
        setSucess(true);
      }
    } catch (err) {
      logger.error(err, account, bounty.id);
    }
  };

  const modal = useRef();
  useEffect(() => {
    // Courtesy of https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
    function handleClickOutside(event) {
      if (modal.current && !modal.current.contains(event.target)) {
        //	updateModal();
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [modal]);

  return (
    <div>
      <div className='justify-center items-center flex overflow-x-hidden text-primary overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
        <div ref={modal} className='min-w-[320px] w-full max-w-[458px] mx-8 px-4'>
          <div className='rounded-sm px-8 py-6 shadow-lg flex flex-col w-full border-web-gray border bg-[#161B22] outline-none focus:outline-none'>
            {success ? (
              <>
                <div className='text-2xl font-semibold pb-4'>Invoicing Details Added</div>
                <p>
                  When bounties funded by your account are merged you{"'"}ll be invoiced based on this information.{' '}
                </p>
                <button className='btn-primary mt-4' onClick={closeModal}>
                  Close
                </button>
              </>
            ) : (
              <>
                <div className='text-2xl font-semibold pb-4'>Invoicing Details</div>
                <p>Add your invoicing details here and we{"'"}ll save them for your contributors.</p>
                <form onSubmit={handleForm}>
                  <div className='flex justify-between my-2'>
                    <label htmlFor='comnpany'>Company Name</label>
                    <input className='input-field' id='company'></input>
                  </div>

                  <div className='flex justify-between my-2'>
                    <label htmlFor='email'>Email</label>
                    <input type='email' className='input-field' id='email'></input>
                  </div>
                  <div className='flex justify-between my-2'>
                    <label htmlFor='city'>City</label>
                    <input className='input-field' id='city'></input>
                  </div>
                  <div className='flex justify-between my-2'>
                    <label htmlFor='streetAddress'>Address</label>
                    <input className='input-field' id='streetAddress'></input>
                  </div>
                  <div className='flex justify-between my-2'>
                    <label htmlFor='country'>Country</label>
                    <input className='input-field' id='country'></input>
                  </div>
                  <div className='flex justify-between my-2'>
                    <label htmlFor='province'>Province/State</label>
                    <input className='input-field' id='province'></input>
                  </div>
                  <input className='btn-primary px-2 cursor-pointer w-full' value={'Submit'} type='submit' />
                </form>
              </>
            )}
          </div>
        </div>
      </div>
      <div className='bg-overlay fixed inset-0'></div>
    </div>
  );
};

export default InvoicingModal;
