import React, { useState, useContext } from 'react';
import StyledInput from './StyledInput';
import StoreContext from '../../../store/Store/StoreContext';

const InvoicingDetails = ({ slim }) => {
  const [appState, dispatch] = useContext(StoreContext);
  const { openQPrismaClient } = appState;
  const [formState, setFormState] = useState({ text: 'Update', className: 'btn-primary' });
  // const formValuesSocial = [{ value: 'twitter' }, { value: 'discord' }];
  const { accountData } = appState;

  const formValuesInvoicing = [
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
            return { [input.id]: input.value };
          });
        interMediateValue.forEach((inputObj) => {
          for (let key in inputObj) {
            formValues[key] = inputObj[key];
          }
        });
        if (formValues.invoicingEmail) {
          try {
            const formData = new FormData();
            formData.append('api_key', process.env.NEXT_PBULIC_CONVERTKIT_API_KEY);
            //   formData.append('email', formValues.email);
            const response = await fetch('https://api.convertkit.com/v3/forms/3697685/subscribe', {
              method: 'POST',
              body: formData,
            });
            await response.json();
          } catch (err) {
            appState.logger.error(err, accountData.id, 'OrgDetails.js1');
          }
        }

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
    return <div>Please signup/login and to make sure your invoicing information is up to date </div>;
  }
  return (
    <div className={`${!slim && 'px-8'} py text-lg`}>
      {!slim && (
        <>
          <div className='flex flex-col flex-1 font-normal pb-16'></div>
          <div className='border-b border-web-gray'>
            <h2 className='text-2xl pb-2'>Organization Invoicing Information</h2>
          </div>
          <div className='note'>
            OpenQ will use these values to generate invoices when the contracts you fund
            {slim && ' (including this one)'} are payed out.
          </div>
        </>
      )}
      <form className='font-normal max-w-[500px] gap-4' onSubmit={submitProfileData}>
        {formValuesInvoicing.map((invoicingField) => {
          return (
            <StyledInput
              highlightEmpty={slim}
              defaultValue={accountData?.[invoicingField.value]}
              key={invoicingField.value}
              value={invoicingField.value}
              type={invoicingField.type}
              optional={!invoicingField.required}
              displayValue={invoicingField.displayValue}
            />
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
