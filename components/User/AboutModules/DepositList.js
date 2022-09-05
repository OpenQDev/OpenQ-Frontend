// Third Party
import React from 'react';

// Custom
import DepositCard from '../../RefundBounty/DepositCard';

const DepositList = ({ deposits }) => {
  return (
    <div className='px-10 py-10 border-web-gray border-b'>
      <h2 className='font-bold uppercase text-gray-300 text-xl pb-4 px-6'>Deposits</h2>

      {deposits.length > 0 ? (
        <ul className='flex flex-wrap justify-between gap-5 pt-2'>
          {deposits.map((deposit) => (
            <DepositCard key={deposit.id} showLink={true} deposit={deposit} />
          ))}
        </ul>
      ) : (
        <div className='px-6 pt-2'>No Deposits</div>
      )}
    </div>
  );
};

export default DepositList;
