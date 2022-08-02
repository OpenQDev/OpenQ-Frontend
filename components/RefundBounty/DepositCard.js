// Third party
import React, { useContext, useState } from 'react';
import StoreContext from '../../store/Store/StoreContext';
import useGetTokenValues from '../../hooks/useGetTokenValues';
import TokenBalances from '../TokenBalances/TokenBalances';
import ToolTipNew from '../Utils/ToolTipNew';
const DepositCard = ({ deposit, refundBounty, extendBounty, status, isOnCorrectNetwork, onDepositPeriodChanged, depositPeriodDays }) => {

	// Context
	const [appState] = useContext(StoreContext);

	// State
	const [tokenValues] = useGetTokenValues(deposit);

	const [expanded, setExpanded] = useState(false);

	return (
		<div className={`pt-3 flex flex-col items-start px-8 sm:px-6 pb-4 hover:bg-[#21262d] ${status === 'refundable' ? ' border-gray-700' : status === 'not-yet-refundable' ? 'border-border-gray' : ' border-border-gray'} border rounded-sm`}>
			<TokenBalances
				lean={true}
				tokenBalances={deposit}
				tokenValues={tokenValues}
				singleCurrency={true}
			/>
			<div className="text-left  py-4">
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
				<div className="w-full md:w-80 flex flex-col space-y-3 text-primary">
					<ToolTipNew
						outerStyles="w-full flex self-center w-1/2"
						hideToolTip={isOnCorrectNetwork}
						toolTipText={'Please switch to the correct network to refund this deposit.'}
						customOffsets={[0, 46]}>
						<button onClick={() => refundBounty(deposit.id)}
							disabled={!isOnCorrectNetwork}
							className={`my-2 ${isOnCorrectNetwork ? 'btn-default' : 'btn-default cursor-not-allowed'}`} >
							Refund
						</button>
					</ToolTipNew>

					{expanded ?
						<div className="w-full text-primary flex flex-wrap md:flex-nowrap md:space-x-3 space-y-3 md:space-y-0 items-center">
							<ToolTipNew
								outerStyles="w-full flex space-x-2"
								hideToolTip={isOnCorrectNetwork && (depositPeriodDays > 0)}
								toolTipText={!isOnCorrectNetwork ?
									'Please switch to the correct network to extend this bounty.' :
									!(depositPeriodDays > 0) ?
										'Please indicate how many days you\'d like to extend your bounty for.' :
										null
								}>
								<button onClick={() => extendBounty(deposit.id)}
									disabled={!isOnCorrectNetwork || !(depositPeriodDays > 0)}
									className={`my-2 px-2 whitespace-nowrap ${isOnCorrectNetwork ?
										(!expanded ?
											'btn-default' :
											(depositPeriodDays > 0 ?
												'btn-primary cursor-pointer'
												: 'btn-default cursor-not-allowed'

											)
										)
										: 'btn-default cursor-not-allowed'
										}`} >
									Extend By
								</button>
							</ToolTipNew>
							<div className="flex w-full input-field-big">
								<div className=' flex items-center gap-3 w-full text-primary'>
									<ToolTipNew mobileX={10} toolTipText={'This is the number of days that your deposit will be in escrow. After this many days, you\'re deposit will be fully refundable if the bounty has still not been claimed.'} >
										<div className='cursor-help rounded-full border border-gray-700 aspect-square leading-4 h-4 box-content text-center font-bold text-gray-700'>?</div>
									</ToolTipNew>
								</div>

								<input
									className="text-primary text-right number outline-none bg-dark-mode w-full px-4 p-0.5"
									autoComplete="off"
									value={depositPeriodDays}
									name={deposit.id}
									id="deposit-period"
									onChange={onDepositPeriodChanged}
									placeholder="0"
								/>

							</div>
						</div>
						:
						<ToolTipNew
							outerStyles="w-full flex self-center"
							hideToolTip={isOnCorrectNetwork}
							toolTipText={'Please switch to the correct network to refund this deposit.'}
							customOffsets={[0, 46]}>
							<button onClick={() => setExpanded(!expanded)}
								disabled={!isOnCorrectNetwork}
								className={`${isOnCorrectNetwork ? 'btn-default'
									: 'btn-default cursor-not-allowed'
									}`} >
								Extend
							</button>
						</ToolTipNew>
					}





				</div>
			}
		</div>

	);
};

export default DepositCard;
