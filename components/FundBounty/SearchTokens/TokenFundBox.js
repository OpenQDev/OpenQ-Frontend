import React, { useState } from 'react';
import TokenSearch from './TokenSearch';
import Image from 'next/image';

const TokenFundBox = ({ onCurrencySelect, onVolumeChange, token, volume }) => {
	const [showTokenSearch, setShowTokenSearch] = useState(false);

	return (
		<div>
			<div className="flex w-full flex-row justify-between items-center pl-14 py-3 rounded-lg py-1 bg-dark-mode border border-web-gray text-white">
				<div className={'px-4 font-bold fundBox-amount bg-dark-mode'}>
					<input
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
						className="flex flex-row items-center space-x-1 py-2 drop-shadow-lg border border-web-gray rounded-lg p-2 pr-2"
						onClick={() => setShowTokenSearch(true)}
					>
						<div className="flex flex-row space-x-5 items-center justify-center">
							<div className="h-1 w-6 pb-6">
								<Image src={token.path} className="rounded-full" alt="n/a" width="40%" height="40%" />
							</div>
						</div>
						<div className="pl-3 text-white">{token.symbol}</div>
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
					setShowTokenSearch={setShowTokenSearch}
					onCurrencySelect={onCurrencySelect}
				/>
			) : null}
		</div>
	);
};

export default TokenFundBox;
