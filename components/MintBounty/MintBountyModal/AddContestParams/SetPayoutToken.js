import React, { useContext } from 'react';
import ToolTipNew from '../../../Utils/ToolTipNew';
import TokenSearch from '../../../FundBounty/SearchTokens/TokenSearch';
import { ethers } from 'ethers';
import MintContext from '../../MintContext';

const SetPayoutToken = ({ content }) => {
  const [mintState, mintDispatch] = useContext(MintContext);
  const { payoutToken, category, hideModal } = mintState;

  function onCurrencySelect(payoutToken) {
    const dispatch = {
      type: 'UPDATE_PAYOUT_TOKEN',
      payload: { ...payoutToken, address: ethers.utils.getAddress(payoutToken.address) },
    };
    mintDispatch(dispatch);
  }

  const setHideModal = (hideModal) => {
    const dispatch = {
      type: 'UPDATE_HIDE_MODAL',
      payload: hideModal,
    };
    mintDispatch(dispatch);
  };

  return (
    <>
      {category === 'Fixed Contest' && (
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
