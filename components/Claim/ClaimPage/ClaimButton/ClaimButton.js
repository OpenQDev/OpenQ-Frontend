import { FeedTrophyIcon } from '@primer/octicons-react';
import React, { useContext } from 'react';
import useDisplayValue from '../../../../hooks/useDisplayValue';
import useIsOnCorrectNetwork from '../../../../hooks/useIsOnCorrectNetwork';
import useWeb3 from '../../../../hooks/useWeb3';
import AuthContext from '../../../../store/AuthStore/AuthContext';
import StoreContext from '../../../../store/Store/StoreContext';
import ToolTipNew from '../../../Utils/ToolTipNew';

const ClaimButton = ({ bounty, tooltipStyle }) => {
  const { account } = useWeb3();
  const [isOnCorrectNetwork] = useIsOnCorrectNetwork();
  const [authState] = useContext(AuthContext);
  const [appState] = useContext(StoreContext);
  const actualValues = useDisplayValue(bounty, appState.utils.formatter.format, 'actual');
  const price = actualValues?.displayValue;
  const claimable = true;
  return (
    <>
      {account && isOnCorrectNetwork && authState.isAuthenticated && (
        <ToolTipNew
          relativePosition={tooltipStyle}
          triangleStyles={'left-3'}
          outerStyles={'relative bottom-1'}
          hideToolTip={price > 0 && claimable}
          toolTipText={
            price <= 0 || !price
              ? 'There are no funds locked to claim, contact the maintainer of this issue.'
              : 'Please first go through all the required steps before you can claim your rewards.'
          }
        >
          <button
            type='submit'
            className={price > 0 && claimable ? 'btn-primary cursor-pointer w-fit' : 'btn-default cursor-not-allowed'}
            disabled={!(price > 0 && claimable)}
            /* onClick={() => setShowClaimLoadingModal(true)} */
          >
            <div className='flex gap-2 items-center'>
              {' '}
              <FeedTrophyIcon />
              Claim
            </div>
          </button>
        </ToolTipNew>
      )}
    </>
  );
};

export default ClaimButton;
