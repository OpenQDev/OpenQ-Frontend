import React, { useContext, useState, useEffect } from 'react';
import StoreContext from '../../../store/Store/StoreContext';
import Image from 'next/image';
import useWeb3 from '../../../hooks/useWeb3';

const TokenList = ({ onCurrencySelect, setShowTokenSearch }) => {
	const [appState] = useContext(StoreContext);
	const [tokenSearchTerm, setTokenSearchTerm] = useState(null);
	const [displayTokens, updateDisplayTokens] = useState();
	const { library, account } = useWeb3();

	useEffect(async () => {
		try {
			const ownedTokens = await appState.openQClient.userOwnedTokenBalances(library, account, appState.tokens);
			const tokens = appState.tokens
				.filter((elem, index) => {
					return ownedTokens[index];
				}).concat(appState.tokens.filter((elem, index) => {
					return !ownedTokens[index];
				}));
			updateDisplayTokens(tokens);
		}
		catch (err) {
			console.log(err);
		}
	}, []);

	function onSelect(token) {
		onCurrencySelect(token);
		setShowTokenSearch(false);
	}

	return (
		<div>
			{/* <div style={{ padding: '25px', margin: '10px', outline: '2px solid pink', borderRadius: '20px' }} > */}
			<div className="pt-3 pb-3 pl-4 bg-dark-mode border border-web-gray rounded-lg overflow-hidden mb-2">
				<div className="">
					<div className="justify-start ">
						<input
							className="outline-none bg-transparent "
							onKeyUp={(e) => setTokenSearchTerm(e.target.value)}
							type="text"
							placeholder="Search name"
						></input>
					</div>
				</div>
			</div>

			<div className="pt-4  h-96 overflow-x-auto">
				{(displayTokens || appState.tokens)
					.filter((token) => {
						return tokenSearchTerm
							? token.name.concat(token.symbol)
								.toLowerCase()
								.indexOf(tokenSearchTerm.toLowerCase()) > -1
							: token;
					})
					.map((token) => {
						return (
							<div className="justify-left items-center" key={token.address}>
								<div
									className="flex flex-row cursor-pointer space-x-4 pb-3"
									onClick={() => onSelect(token)}
								>
									<div className="pt-2">
										<Image
											src={token.path}
											className="rounded-full"
											alt="n/a"
											width="25%"
											height="25%"
										/>
									</div>
									<div className="flex flex-col">
										<div className="font-bold">{token.symbol}</div>
										<div className="text-sm text-gray-200">{token.name}</div>
									</div>
								</div>
							</div>
						);
					})}
			</div>
		</div>
	);
};

export default TokenList;
