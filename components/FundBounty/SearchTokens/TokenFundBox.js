import React, { useState } from 'react';
import TokenSearch from './TokenSearch';
import Image from 'next/image';

const TokenFundBox = ({ onCurrencySelect, onVolumeChange, token, volume }) => {
	const [showTokenSearch, setShowTokenSearch] = useState(false);

	return (
		<div className="flex flex-row space-x-3 font-medium text-base text-gray-600 ">
			<Image
				src={token.logoURI}
				alt="n/a"
				width="16"
				height="16"
			/>
			<button className="flex flex-row space-x-1 bg-pink-600 text-white rounded-lg p-2 pr-2" onClick={() => setShowTokenSearch(true)}>
				<div className="pl-2 pt-">{token.symbol}</div>
				<div>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-5 w-5"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fillRule="evenodd"
							d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
							clipRule="evenodd"
						/>
					</svg>
				</div>
			</button>
			<div className={'fundBox-amount'}>
				<input className={'number'} value={volume} placeholder={'0'} id='amount' onChange={(event) => onVolumeChange(event.target.value)} />
			</div>
			{showTokenSearch ? <TokenSearch setShowTokenSearch={setShowTokenSearch} onCurrencySelect={onCurrencySelect} /> : null}
		</div>
	);
};

export default TokenFundBox;