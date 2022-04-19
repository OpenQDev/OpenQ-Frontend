// Third Party
import React, { useContext } from 'react';
import StoreContext from '../../store/Store/StoreContext';
import useGetTokenValues from '../../hooks/useGetTokenValues';
import TokenBalances from '../TokenBalances/TokenBalances';
import ToolTip from '../Utils/ToolTip';
const DepositCard = ({ deposit, refundBounty, status, isOnCorrectNetwork }) => {
	// Context
	const [appState] = useContext(StoreContext);

	// State
	const [tokenValues] = useGetTokenValues(deposit);
	console.log('deposit', deposit);
	console.log('tokenValues from deposit', tokenValues);

	return (
		<div className={`flex flex-col items-start px-8 sm:px-6 pb-4 max-w-sm bg-web-gray/20 ${status === 'refundable' ? ' border-pink-300' : status === 'not-yet-refundable' ? '' : ' border-web-gray'} border rounded-md`}>
			<TokenBalances
				tokenBalances={deposit}
				tokenValues={tokenValues}
				singleCurrency={true}
			/>
			<div className="text-left text-white pb-4">
				Deposited on: {appState.utils.formatUnixDate(parseInt(deposit.receiveTime))}
			</div>
			{deposit.refunded ?
				(<div className="text-left text-white pb-2">
					Refunded on: {appState.utils.formatUnixDate(parseInt(deposit.refundTime))}
				</div>)
				:
				(<div className="text-left text-white pb-2">
					Refundable on: {appState.utils.formatUnixDate(parseInt(deposit.receiveTime) + parseInt(deposit.expiration))}
				</div>)
			}
			{status === 'refundable' &&
				<ToolTip
					outerStyles="w-full flex self-center w-1/2"
					hideToolTip={isOnCorrectNetwork}
					toolTipText={'Please switch to the correct network to refund this deposit.'}
					customOffsets={[0, 46]}>
					<button onClick={() => refundBounty(deposit.id)}
						disabled={!isOnCorrectNetwork}
						className={`items-left text-lg text-white self-center ${isOnCorrectNetwork ? 'sm-confirm-btn' : 'sm-confirm-btn-disabled cursor-not-allowed'}`} >
						Refund
					</button>
				</ToolTip>
			}
		</div>

	);
};

export default DepositCard;
