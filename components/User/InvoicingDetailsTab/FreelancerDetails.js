import React, { useState, useContext, useEffect } from 'react';
import StyledInput from './StyledInput';
import useWeb3 from '../../../hooks/useWeb3';
import StoreContext from '../../../store/Store/StoreContext';
import AssociationModal from '../GithubRegistration/AssociateAddress';

import useAuth from '../../../hooks/useAuth';

const InvoicingDetails = () => {
  const { account } = useWeb3();
  const [appState, dispatch] = useContext(StoreContext);
  const { logger, openQPrismaClient } = appState;
  const [formState, setFormState] = useState({ text: 'Update', className: 'btn-primary' });
  const [githubUser, setGithubUser] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  // const formValuesSocial = [{ value: 'twitter' }, { value: 'discord' }];
  const [authState] = useAuth();
  const { githubId } = authState;
  const [freelancerInfo, setFreelancerInfo] = useState();

  const getPdf = async () => {
    setShowPreview(!showPreview);
  };

  // TODO - add encryption to local data
  useEffect(() => {
    if (githubId) {
      const getGithubUser = async () => {
        const githubUser = await appState.githubRepository.fetchUserById(githubId);
        setGithubUser(githubUser);
      };
      getGithubUser();
    }
  }, [githubId]);

  useEffect(() => {
    const fetchFreelancerInfo = async () => {
      try {
        const freelancerInfo = await appState.openQPrismaClient.getUser(account);

        if (freelancerInfo) {
          setFreelancerInfo(freelancerInfo);
        } else {
          const freelancerInfo = await appState.openQPrismaClient.getLocalUser(account);
          setFreelancerInfo(freelancerInfo);
        }
      } catch (error) {
        logger.error(error);
      }
    };
    fetchFreelancerInfo();
  }, []);
  const formValuesInvoicing = [
    {
      value: 'company',
      displayValue: 'Company',
    },

    {
      value: 'billingName',
      displayValue: 'Billing Name',
      required: true,
    },

    {
      value: 'city',
      required: true,
    },
    {
      value: 'streetAddress',

      displayValue: 'Billing Address',
      required: true,
    },
    { value: 'postalCode', displayValue: 'Postal Code', required: true },
    { value: 'country', required: true },
    { value: 'phoneNumber', displayValue: 'Phone Number', required: true },
    { value: 'province', displayValue: 'State/Province', required: true },
    { value: 'email', required: true },
    { value: 'invoiceNumber', displayValue: 'Invoice Number', required: true, type: 'integer' },
    { value: 'taxId', displayValue: 'Tax ID', required: true },
    { value: 'vatNumber', displayValue: 'VAT Number', required: true },
    { value: 'vatRate', displayValue: 'VAT Rate', required: true, type: 'number' },
    { value: 'memo', displayValue: 'Memo' },
  ];

  const submitProfileData = async (e) => {
    e.preventDefault();
    setFormState({ text: 'Updating...', className: 'btn-default', disabled: true });
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
        const formValues = { github: githubId };
        const form = e.target;
        const interMediateValue = Object.values(form)
          .filter((input) => input.nodeName === 'INPUT' && input.type !== 'submit')
          .map((input) => {
            if (input.type === 'number') {
              const numberValue = parseFloat(0);
              if (isNaN(numberValue)) {
                throw new Error('Please enter a valid number');
              }
              return { [input.id]: parseFloat(input.value || 0) || 0 };
            }
            if (!input.value && input.required) {
              throw new Error('Please enter a value for ${input.id}');
            }
            return { [input.id]: input.value };
          });
        interMediateValue.forEach((inputObj) => {
          for (let key in inputObj) {
            if (key !== 'email') {
              formValues[key] = inputObj[key];
            }
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
            await response.json();
          } catch (err) {
            appState.logger.error(err);
          }
        }

        const { updateUser } = await openQPrismaClient.updateUser(formValues);

        if (updateUser) {
          setFormState({ text: 'Updated', className: 'btn-primary', disabled: false });
          setTimeout(() => {
            setFormState({ text: 'Update', className: 'btn-primary', disabled: false });
          }, 5000);
          resolve(true);
        }
      } catch (err) {
        reject(err);
      }
    });
  };

  return (
    <div className='px-8 py text-lg'>
      <div className='flex flex-col flex-1 font-normal pb-16'>
        {!githubId && <AssociationModal githubId={githubId} user={githubUser} renderError={''} redirectUrl={''} />}
      </div>
      <div className='border-b border-web-gray flex justify-between'>
        <h2 className='text-2xl pb-2'>Freelancer Invoicing Information</h2>
        <button onClick={getPdf} className='btn-default text-xs py-0.75 my-0.75 h-7'>
          {showPreview ? 'Edit' : 'Preview'} Invoice
        </button>
      </div>{' '}
      <div className='note'>Freelancer invoicing details are never held on OpenQ's servers.</div>
      {showPreview ? (
        <iframe className='w-full h-[1400px] py-16' src={`http://localhost:3007/preview?account=${account}`}></iframe>
      ) : (
        <>
          <form className='font-normal max-w-[500px] gap-4' onSubmit={submitProfileData}>
            {formValuesInvoicing.map((invoicingField) => {
              return (
                <StyledInput
                  defaultValue={freelancerInfo?.[invoicingField.value]}
                  key={invoicingField.value}
                  value={invoicingField.value}
                  type={invoicingField.type}
                  optional={!invoicingField.required}
                  displayValue={invoicingField.displayValue}
                />
              );
            })}

            <input
              className={`${formState.className}  text-sm py-1 px-2 text-center w-20 cursor-pointer`}
              value={formState.text}
              type='submit'
            />
          </form>
        </>
      )}
    </div>
  );
};
export default InvoicingDetails;