import React, { useState, useEffect, useContext } from 'react';
import TokenSearch from './TokenSearch';
import Image from 'next/image';
import StoreContext from '../../../store/Store/StoreContext';

const TokenFundBox = ({ onCurrencySelect, onVolumeChange, token,  volume }) => {
	const [showTokenSearch, setShowTokenSearch] = useState(false);
	const [polygonTokens, setPolygonTokens] = useState([]);
	const [openQTokens, setOpenQTokens] = useState([]);
	const [appState] = useContext(StoreContext);
	const batch = 100;
	useEffect(async()=>{
		let didCancel;
		const polygonDefaultTokens = await appState.tokenClient.getTokenMetadata(0, batch, 'polygon');
		const constantTokens = await appState.tokenClient.getTokenMetadata(0, 100, 'constants');
		
		if(!didCancel)			setOpenQTokens(constantTokens);
		
		if(!didCancel)	setPolygonTokens(polygonDefaultTokens);

		return ()=>didCancel = true;
	},[]);
	
	return (
		<div>
			<div className="flex w-full flex-row justify-between items-center pl-14 py-3 py-1 input-field-big">
				<div className={'px-4 font-bold fundBox-amount bg-dark-mode'}>
					<input
						aria-label="amount"
						className="font-semibold text-2xl number outline-none bg-dark-mode text-tinted w-full"
						autoComplete="off"
						value={volume}
						placeholder={'0.0'}
						id="amount"
						onChange={(event) => onVolumeChange(event.target.value)}
					/>
				</div>
				<div className="pr-5">
					<button
						className="flex flex-row items-center space-x-1 py-2 drop-shadow-lg btn-default p-2 pr-2"
						onClick={() => setShowTokenSearch(true)}
					>
						<div className="flex flex-row space-x-5 items-center justify-center">
							<div className="h-1 w-6 pb-6">
								<Image src={token.path || token.logoURI || '/crypto-logos/ERC20.svg'} className="rounded-full" alt="n/a" width="40%" height="40%" />
							</div>
						</div>
						<div className="pl-3 ">{token.symbol}</div>
						<div>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5"
								viewBox="0 0 20 20"
								fill="white"
							>
								<path
									fillRule="evenodd"
									d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
									clipRule="evenodd"
								/>
							</svg>
						</div>
					</button>
				</div>
			</div>
			{showTokenSearch ? (
				<TokenSearch
					polygonTokens={polygonTokens}
					openQTokens = {openQTokens}
					currentCursor ={batch}
					setShowTokenSearch={setShowTokenSearch}
					onCurrencySelect={onCurrencySelect}
				/>
			) : null}
		</div>
	);
};

export default TokenFundBox;
