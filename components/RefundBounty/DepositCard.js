// Third party
import React, { useContext } from 'react';
import StoreContext from '../../store/Store/StoreContext';
import useGetTokenValues from '../../hooks/useGetTokenValues';
import TokenBalances from '../TokenBalances/TokenBalances';
import ToolTipNew from '../Utils/ToolTipNew';
const DepositCard = ({ deposit, refundBounty, status, isOnCorrectNetwork }) => {
	// Context
	const [appState] = useContext(StoreContext);

	// State
	const [tokenValues] = useGetTokenValues(deposit);

	return (
		<div className={`pt-3 flex flex-col items-start px-8 max-w-[90%] sm:px-6 pb-4 max-w-sm hover:bg-[#21262d] ${status === 'refundable' ? ' border-gray-700' : status === 'not-yet-refundable' ? 'border-border-gray' : ' border-border-gray'} border rounded-sm`}>
			<TokenBalances
				tokenBalances={deposit}
				tokenValues={tokenValues}
				singleCurrency={true}
			/>
			<div className="text-left  pb-4">
				Deposited on: {appState.utils.formatUnixDate(parseInt(deposit.receiveTime))}
			</div>
			{deposit.refunded ?
				(<div className="text-left  pb-2">
					Refunded on: {appState.utils.formatUnixDate(parseInt(deposit.refundTime))}
				</div>)
				:
				(<div className="text-left  pb-2">
					Refundable on: {appState.utils.formatUnixDate(parseInt(deposit.receiveTime) + parseInt(deposit.expiration))}
				</div>)
			}
			{status === 'refundable' &&
				<ToolTipNew
					outerStyles="w-full flex self-center"
					hideToolTip={isOnCorrectNetwork}
					toolTipText={'Please switch to the correct network to refund this deposit.'}
					customOffsets={[0, 46]}>
					<button onClick={() => refundBounty(deposit.id)}
						disabled={!isOnCorrectNetwork}
						className={`my-2 items-left w-full  self-center ${isOnCorrectNetwork ? 'btn-primary' : 'btn-default cursor-not-allowed'}`} >
						Refund
					</button>
				</ToolTipNew>
			}
		</div>

	);
};

export default DepositCard;
