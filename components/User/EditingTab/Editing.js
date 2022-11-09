import React, { useState, useContext, useEffect } from 'react';
import StyledInput from './StyledInput';
import useWeb3 from '../../../hooks/useWeb3';
import StoreContext from '../../../store/Store/StoreContext';
import AssociationModal from '../GithubRegistration/AssociationModal';
import axios from 'axios';
import useAuth from '../../../hooks/useAuth';

const Editing = () => {
  const { account } = useWeb3();
  const [appState, dispatch] = useContext(StoreContext);
  const { logger, openQPrismaClient } = appState;
  // const [success, setSucess] = useState(null);
  const [subscribed, setSubscribed] = useState(null);
  const [subscriptionError, setSubscriptionError] = useState();
  const [githubUser, setGithubUser] = useState({});
  // const formValuesSocial = [{ value: 'twitter' }, { value: 'discord' }];
  const [authState] = useAuth();
  const { githubId } = authState;

  useEffect(() => {
    if (githubId) {
      const getGithubUser = async () => {
        const githubUser = await appState.githubRepository.fetchUserById(githubId);
        setGithubUser(githubUser);
      };
      getGithubUser();
    }
  }, [githubId]);
  /*
  const formValuesInvoicing = [
    {
      value: 'company',
      displayValue: 'Company',
    },

    {
      value: 'email',
    },

    {
      value: 'city',
    },
    {
      value: 'streetAddress',

      displayValue: 'Address',
    },
    { value: 'country' },
    { value: 'province', displayValue: 'State/Province' },
  ];
*/
  const formValuesContact = [
    {
      value: 'email',
    },
    { value: 'github' },
  ];

  const signMessage = async () => {
    const message = 'OpenQ';
    const signature = await window.ethereum.request({
      method: 'personal_sign',
      params: [message, account],
    });
    return signature;
  };

  const submitProfileData = async (e) => {
    return new Promise(async (resolve, reject) => {
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
        if (formValues.email) {
          try {
            const formData = new FormData();
            formData.append('api_key', 'JlUKxDNJAmbFF44byOHTNQ');
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
            appState.logger.error(err);
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
        logger.error(err, account, 'Editing1');
      }
    } else {
      setSubscriptionError(true);
    }
  };
  /*
  const handleForm = async (e) => {
    try {
      e.preventDefault();
      const success = await submitProfileData(e);

      if (success) {
        setSucess(true);
        setTimeout(() => {
          setSucess(null);
        }, 1000);
      }
    } catch (err) {
      logger.error(err, account, 'Editing1');
    }
  };*/

  return (
    <div className='px-8 py-6 text-lg  font-semibold'>
      <h2 className='text-2xl pb-4 '>Subscribe</h2>
      <form onSubmit={handleSubscribe} className='pb-4 font-normal max-w-[500px] gap-4'>
        <p> Subscribe to our email notification system to get latest tasks that fit to your Github profile</p>
        {formValuesContact.map((invoicingField) => {
          return (
            <StyledInput
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
            'We cant send you personalized notifications about new tasks without having your Github profile'}
        </span>
      </form>
      <div className='flex flex-col flex-1 font-normal'>
        {githubId && <AssociationModal githubId={githubId} user={githubUser} renderError={''} redirectUrl={''} />}
      </div>
      {/*<h2 className='text-2xl '>Edit Public Profile</h2>
     
      <form className='font-normal py-4 max-w-[500px] gap-4' onSubmit={handleForm}>
        <div className='py-4'>
          <h3 className='font-semibold text-muted pb-2'>Invoicing</h3>
          {formValuesInvoicing.map((invoicingField) => {
            return (
              <StyledInput
                key={invoicingField.value}
                value={invoicingField.value}
                displayValue={invoicingField.displayValue}
              />
            );
          })}
        </div>
        <div className='py-4'>
          <h3 className='font-semibold text-muted pb-2'>Socials</h3>
          {formValuesSocial.map((invoicingField) => {
            return (
              <StyledInput
                key={invoicingField.value}
                value={invoicingField.value}
                displayValue={invoicingField.displayValue}
              />
            );
          })}
        </div>

        <input
          className='btn-primary px-2 cursor-pointer w-full'
          value={success !== null ? 'Saved' : 'Save'}
          type='submit'
        />
      </form>
      */}
    </div>
  );
};
export default Editing;
