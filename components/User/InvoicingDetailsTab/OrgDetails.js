import React, { useState, useContext } from 'react';
import StyledInput from './StyledInput';
import StoreContext from '../../../store/Store/StoreContext';

const InvoicingDetails = ({ slim, emailOnly }) => {
  const [appState, dispatch] = useContext(StoreContext);
  const { openQPrismaClient } = appState;
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [formState, setFormState] = useState({ text: 'Update', className: 'btn-primary' });
  // const formValuesSocial = [{ value: 'twitter' }, { value: 'discord' }];
  const { accountData } = appState;

  const formValuesInvoicing = emailOnly
    ? [{ value: 'invoicingEmail', displayValue: 'Invoicing Email', required: true }]
    : slim
    ? [
        {
          value: 'company',
          displayValue: 'Company',
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
        { value: 'invoicingEmail', displayValue: 'Invoicing Email', required: true },
        { value: 'country', required: true },
        { value: 'province', displayValue: 'State/Province', required: true },
      ]
    : [
        {
          value: 'company',
          displayValue: 'Company',
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
        { value: 'country', required: true },
        { value: 'province', displayValue: 'State/Province', required: true },
      ];
  const submitProfileData = async (e) => {
    e.preventDefault();
    setFormState({ text: 'Updating...', className: 'btn-default', disabled: true });
    return new Promise(async (resolve, reject) => {
      try {
        const { github, email } = accountData;
        const formValues = github ? { github } : { email };
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
            if (input.value === 'invoicingEmail') {
              const emailRegex = new RegExp(
                // eslint-disable-next-line no-control-regex
                /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/
              );

              const emailValid = emailRegex.test(input.value);
              setEmailInvalid(!emailValid);
              if (!emailValid) throw new Error('Please enter a valid email');
            }
            return { [input.id]: input.value };
          });
        interMediateValue.forEach((inputObj) => {
          for (let key in inputObj) {
            formValues[key] = inputObj[key];
          }
        });

        const { updateUser } = await openQPrismaClient.updateUser(formValues);
        if (updateUser) {
          const accountDispatch = {
            type: 'UPDATE_ACCOUNT_DATA',
            payload: {
              ...accountData,
              ...updateUser,
            },
          };
          dispatch(accountDispatch);
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
  if (!accountData.id) {
    return <div>Please signup/login and make sure your invoicing information is up to date </div>;
  }
  return (
    <div className={`${!slim && 'px-8'} py text-lg`}>
      {!slim && (
        <>
          <div className='flex justify-between mt-12'>
            <h2 className='flex justify-between w-full text-2xl pb-4 font-semibold border-b border-gray-700'>
              <div>{emailOnly ? 'Organization Email' : 'Organization Invoicing Information'}</div>
            </h2>
          </div>
          {!emailOnly && (
            <div className='mt-4 note'>
              OpenQ will use these values to generate invoices when the contracts you fund
              {slim && ' (including this one)'} are payed out.
            </div>
          )}
        </>
      )}
      <form className='font-normal max-w-[500px] gap-4' onSubmit={submitProfileData}>
        {formValuesInvoicing.map((invoicingField) => {
          return (
            <>
              {' '}
              <StyledInput
                highlightEmpty={slim}
                defaultValue={accountData?.[invoicingField.value]}
                key={invoicingField.value}
                value={invoicingField.value}
                type={invoicingField.type}
                optional={!invoicingField.required}
                displayValue={invoicingField.displayValue}
              />
              {emailInvalid && invoicingField.value === 'invoicingEmail' && (
                <div className='note mb-2 -mt-2 text-danger'>Please enter a valid email address</div>
              )}
              {emailOnly && (
                <div className='note my-4'>
                  This email will be publicly accesible and will be used by freelancers to communicate with you. OpenQ
                  will also use this email to send any documents you require from freelancers.
                </div>
              )}
            </>
          );
        })}

        <input
          className={`${formState.className} text-sm py-1 px-2 text-center w-20 cursor-pointer`}
          value={formState.text}
          type='submit'
        />
      </form>
    </div>
  );
};
export default InvoicingDetails;
