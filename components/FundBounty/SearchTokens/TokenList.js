import React, { useContext, useState } from 'react';
import StoreContext from '../../../store/Store/StoreContext';
import Image from 'next/image';

const TokenList = ({ onCurrencySelect, setShowTokenSearch }) => {
	const [appState] = useContext(StoreContext);
	const [tokenSearchTerm, setTokenSearchTerm] = useState(null);

	function onSelect(token) {
		onCurrencySelect(token);
		setShowTokenSearch(false);
	}
	return (
		<>
			<div style={{ padding: '25px', margin: '10px', outline: '2px solid pink', borderRadius: '20px' }} >
				<input onKeyUp={(e) => setTokenSearchTerm(e.target.value)} type="text"></input>
			</div>
			<ol>{
				appState.tokens.filter(token => {
					return tokenSearchTerm ? token.name.toLowerCase().indexOf(tokenSearchTerm.toLowerCase()) > -1 : token;
				}).map(token => {
					return (
						<li key={token.name}>
							<div
								className={'cursor-pointer'}
								style={{ padding: '25px', margin: '10px', outline: '2px solid pink', borderRadius: '20px' }}
								onClick={() => onSelect(token)}
							>
								<div>{token.symbol}</div>
								<Image
									src={token.logoURI}
									alt="n/a"
									width="16"
									height="16"
								/>
							</div>
						</li>
					);
				})}</ol >
		</>
	);
};

export default TokenList;