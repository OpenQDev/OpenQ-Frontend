// Third Party
import React, { useContext } from 'react';
import StoreContext from '../../store/Store/StoreContext';
import useGetTokenValues from '../../hooks/useGetTokenValues';
import TokenBalances from '../TokenBalances/TokenBalances';
const DepositCard = ({ deposit, refundBounty, status }) => {
	// Context
	const [appState] = useContext(StoreContext);

	// State
	const [tokenValues] = useGetTokenValues(deposit);

	return (
		<div className={`flex flex-col items-start px-8 sm:px-6 pb-4 max-w-sm bg-web-gray/20 border-${status==='refundable'? 'pink-300' : status==='not-yet-refundable'?'green-300':'web-gray'} border rounded-md`}>
			<TokenBalances 
				tokenBalances={deposit}
				tokenValues={tokenValues} />
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
			{status==='refundable' &&
			<button  className='items-left w-1/2 text-lg text-white self-center sm-confirm-btn'  onClick={() => refundBounty(deposit.id)}>
					Refund
			</button>}
		</div>
		
	);
};

export default DepositCard;
