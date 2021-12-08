import React, { useContext } from 'react';
import StoreContext from '../../../store/Store/StoreContext';
import Image from 'next/image';

const TokenList = ({ onCurrencySelect }) => {
	const [appState] = useContext(StoreContext);

	return (
		<ol>{appState.tokens.map(token => {
			return (
				<li key={token.name}>
					<div
						className={'cursor-pointer'}
						style={{ padding: '25px', margin: '10px', outline: '2px solid pink', borderRadius: '20px' }}
						onClick={() => onCurrencySelect(token)}
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
	);
};

export default TokenList;