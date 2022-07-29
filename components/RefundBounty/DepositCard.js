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
		<div className={`pt-3 flex flex-col items-start px-8 sm:px-6 pb-4 max-w-sm hover:bg-[#21262d] ${status === 'refundable' ? ' border-gray-700' : status === 'not-yet-refundable' ? 'border-border-gray' : ' border-border-gray'} border rounded-sm`}>
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
				<div className="w-full md:w-80 flex flex-col space-y-3">
					<ToolTipNew
						outerStyles="w-full flex self-center w-1/2"
						hideToolTip={isOnCorrectNetwork}
						toolTipText={'Please switch to the correct network to refund this deposit.'}
						customOffsets={[0, 46]}>
						<button onClick={() => refundBounty(deposit.id)}
							disabled={!isOnCorrectNetwork}
							className={`items-left text-lg  self-center ${isOnCorrectNetwork ? 'sm-confirm-btn' : 'sm-confirm-btn-disabled cursor-not-allowed'}`} >
							Refund
						</button>
					</ToolTipNew>

					{expanded ?
						<div className="w-full flex flex-wrap md:flex-nowrap md:space-x-3 space-y-3 md:space-y-0 self-center">
							<ToolTipNew
								outerStyles="w-full flex space-x-2"
								hideToolTip={isOnCorrectNetwork && (depositPeriodDays > 0)}
								toolTipText={!isOnCorrectNetwork?
									'Please switch to the correct network to extend this bounty.' :
									!(depositPeriodDays > 0) ?
										'Please indicate how many days you\'d like to extend your bounty for.' :
										null
								}
								customOffsets={[0, 46]}>
								<button onClick={() => extendBounty(deposit.id)}
									disabled={!isOnCorrectNetwork || !(depositPeriodDays > 0)}
									className={`items-left text-lg  self-center ${isOnCorrectNetwork ?
										(!expanded ?
											'sm-confirm-btn' :
											(depositPeriodDays > 0 ?
												'font-mont rounded-lg w-full py-2 font-semibold border border-green bg-green bg-opacity-10 hover:bg-green hover:bg-opacity-30 cursor-pointer'
												: 'sm-confirm-btn-disabled cursor-not-allowed'

											)
										)
										: 'sm-confirm-btn-disabled cursor-not-allowed'
									}`} >
									Extend By
								</button>
							</ToolTipNew>
							<div className="flex w-full flex-row justify-between items-center h-12 px-4 py-2 rounded-lg bg-dark-mode border border-web-gray">
								<div className=' flex items-center gap-3 w-full'>
									<ToolTipNew customOffsets={[0, 36]} outerStyles={''} mobileX={10} toolTipText={'This is the number of days that your deposit will be in escrow. After this many days, you\'re deposit will be fully refundable if the bounty has still not been claimed.'} >
										<div className='cursor-help rounded-full border-2 border-web-gray aspect-square leading-6 h-6 box-content text-center font-bold text-web-gray'>?</div>
									</ToolTipNew>
								</div>

								<div className={'px-4 font-bold fundBox-amount bg-dark-mode'}>
									<input
										className="font-semibold text-right /60 text-2xl number outline-none bg-dark-mode w-full flex-1"
										autoComplete="off"
										value={depositPeriodDays}
										name={deposit.id}
										id="deposit-period"
										onChange={onDepositPeriodChanged}
										placeholder="0"
									/>
								</div>
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
								className={`items-left text-lg  self-center ${isOnCorrectNetwork ? 'sm-confirm-btn'
									: 'sm-confirm-btn-disabled cursor-not-allowed'
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
