import React, { useContext, useEffect } from 'react';
import ToolTipNew from '../../../../Utils/ToolTipNew';
import TokenSearch from '../../../../TokenSelection/TokenSearch';
import MintContext from '../../../MintContext';
import TokenContext from '../../../../TokenSelection/TokenStore/TokenContext';

const SetPayoutToken = ({ content }) => {
  const [mintState, mintDispatch] = useContext(MintContext);
  const { category, hideModal } = mintState;
  const [tokenState] = useContext(TokenContext);
  const { token } = tokenState;

  useEffect(() => {
    const dispatch = {
      type: 'UPDATE_PAYOUT_TOKEN',
      payload: token,
    };
    mintDispatch(dispatch);
  }, [token]);

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
              <ToolTipNew innerStyles={'w-40 whitespace-normal'} toolTipText={content.message}>
                <div className='cursor-help rounded-full border border-[#c9d1d9] aspect-square text-sm leading-4 h-4 box-content text-center font-bold text-primary'>
                  ?
                </div>
              </ToolTipNew>
            </div>
          </div>
          <div className=''>
            <TokenSearch setShowTokenSearch={setHideModal} showTokenSearch={hideModal} alone={true} />
          </div>
        </div>
      )}
    </>
  );
};
export default SetPayoutToken;
