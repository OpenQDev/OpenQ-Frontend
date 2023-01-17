import React, { useState, useContext } from 'react';

import useWeb3 from '../../hooks/useWeb3';
import StyledInput from '../User/InvoicingDetailsTab/StyledInput';
import StoreContext from '../../store/Store/StoreContext';
import EmailLogin from '../Authentication/EmailLogin';

const Subscribe = ({ user }) => {
  // state variables
  const [subscribed, setSubscribed] = useState(null);
  const [appState] = useContext(StoreContext);
  const { accountData } = appState;
  const { logger, openQPrismaClient } = appState;
  const { account } = useWeb3();
  const [subscriptionError, setSubscriptionError] = useState();

  if (!appState.showSubscribed) return <></>;
  const submitProfileData = async (e) => {
    return new Promise(async (resolve, reject) => {
      try {
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
        if (formValues.email) {
          try {
            const formData = new FormData();
            formData.append('api_key', process.env.NEXT_PUBLIC_CONVERTKIT_API_KEY);
            formData.append('email', formValues.email);
            const response = await fetch('https://api.convertkit.com/v3/forms/3697685/subscribe', {
              method: 'POST',
              body: formData,
            });
            const subscribeJson = await response.json();
            if (subscribeJson) {
              setSubscribed(true);
            }
          } catch (err) {
            logger.error(err, accountData.id, 'Subscribe.js1');
          }
        }

        const { updateUser } = await openQPrismaClient.updateUser(formValues);
        if (updateUser) {
          Object.values(form)
            .filter((input) => input.nodeName === 'INPUT' && input.type !== 'submit')
            .map((input) => {
              input.value = '';
            });
          resolve(true);
        }
      } catch (err) {
        reject(err);
      }
    });
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formValues = {};
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
    if (formValues.email && formValues.github) {
      try {
        const success = await submitProfileData(e);

        if (success) {
          setSubscribed(true);
          setTimeout(() => {
            setSubscribed(null);
          }, 1000);
        }
      } catch (err) {
        logger.error(err, accountData.id, 'Subscribe.js2');
      }
    } else {
      setSubscriptionError(true);
    }
  };
  const formValuesContact = [
    {
      value: 'email',
      defaultValue: user.email,
    },
    { value: 'github', displayValue: 'Github Profile Url', defaultValue: `https://github.com/${user.login}` },
  ];

  return (
    <div>
      <EmailLogin />
      <form onSubmit={handleSubscribe} className='pb-4 font-normal max-w-[500px] gap-4'>
        <p> Subscribe to our email notification system to get latest tasks that fit your Github profile</p>
        {formValuesContact.map((invoicingField) => {
          return (
            <StyledInput
              defaultValue={invoicingField.defaultValue}
              key={invoicingField.value}
              value={invoicingField.value}
              displayValue={invoicingField.displayValue}
            />
          );
        })}
        <input
          className='btn-primary px-2 cursor-pointer w-full'
          value={subscribed !== null ? 'Subscribed' : 'Subscribe'}
          type='submit'
        />
        <span className='text-sm h-8'>
          {subscriptionError &&
            `We can't send you personalized notifications about new tasks without having your Github profile`}
        </span>
      </form>
    </div>
  );
};
export default Subscribe;
