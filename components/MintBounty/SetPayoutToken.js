import React from 'react';
import ToolTipNew from '../Utils/ToolTipNew';
import TokenSearch from '../FundBounty/SearchTokens/TokenSearch';
import { ethers } from 'ethers';

const SetPayoutToken = ({ category, targetCategory, payoutTokenState, hideModalState, content }) => {
  const [payoutToken, setPayoutToken] = payoutTokenState;
  const [hideModal, setHideModal] = hideModalState;
  function onCurrencySelect(payoutToken) {
    setPayoutToken({
      ...payoutToken,
      address: ethers.utils.getAddress(payoutToken.address),
    });
  }

  return (
    <>
      {' '}
      {category === targetCategory && (
        <div className='flex flex-col w-11/12 items-start py-2 gap-2 text-base pb-4'>
          <div className='flex items-center gap-2'>
            <div className='flex items-center gap-2 font-semibold '>
              {content.body}
              <ToolTipNew mobileX={10} toolTipText={content.message}>
                <div className='cursor-help rounded-full border border-[#c9d1d9] aspect-square text-sm leading-4 h-4 box-content text-center font-bold text-primary'>
                  ?
                </div>
              </ToolTipNew>
            </div>
          </div>
          <div className=''>
            <TokenSearch
              token={payoutToken}
              setShowTokenSearch={setHideModal}
              showTokenSearch={hideModal}
              onCurrencySelect={onCurrencySelect}
              alone={true}
            />
          </div>
        </div>
      )}
    </>
  );
};
export default SetPayoutToken;
