// Third Party
import React, { useContext, useState, useCallback , useRef} from 'react';

// Custom
import StoreContext from '../../../store/Store/StoreContext';
import TokenDisplay from  '../../TokenBalances/TokenDisplay';

const TokenList = ({ onCurrencySelect, setShowTokenSearch,  tokenSearchTerm, customTokens,  pageTokens, lists }) => {
	const [appState] = useContext(StoreContext);
	const [polygonTokens, setPolygonTokens] = useState(pageTokens);
	const [isComplete, setIsComplete] = useState(false);
	const batch = 100;
	const [cursor, setCursor] = useState(batch);
	
	let displayTokens=[appState.tokens[0], ...customTokens];
	
	if(lists.openq){
		const openqTokens = appState.tokens.slice(1).filter((token)=>!displayTokens.some((displayToken)=>displayToken.address===token.address.toLowerCase()));
		displayTokens=displayTokens.concat(openqTokens);
	}

	if(lists.polygon){
		const openqTokens = polygonTokens.filter((token)=>!displayTokens.some((displayToken)=>displayToken.address.toLowerCase()===token.address));
		displayTokens=displayTokens.concat(openqTokens);
	}

	const getMoreData = async()=>{
		setIsComplete(true);
		const newPolygonTokens = await appState.tokenClient.getTokenMetadata(cursor, batch);
		setCursor(batch+cursor);
		setPolygonTokens([...polygonTokens, ...newPolygonTokens]);
		if(newPolygonTokens.length===100){
			setIsComplete(false);

		}
	};

	const observer = useRef();

	const lastElem = useCallback((node)=>{
		if (observer.current) { observer.current.disconnect(); }
		if (node) {
			let options = {
				rootMargin: '100px',
				threshold: .1
			};
			const callback = (entries) => {
				if (entries[0].isIntersecting  && !isComplete) {
					getMoreData();
				}

			};
			observer.current = new IntersectionObserver(callback, options);
			observer.current.observe(node);
		}
	});

	function onSelect(token) {
		onCurrencySelect(token);
		setShowTokenSearch(false);
	}

	return (
		<>
			{/* <div style={{ padding: '25px', margin: '10px', outline: '2px solid pink', borderRadius: '20px' }} > */}

			<div className="pt-4 ">
				{
					displayTokens.filter((token) => {
						return tokenSearchTerm
							? token.name.concat(token.symbol).concat(token.address)
								.toLowerCase()
								.indexOf(tokenSearchTerm.toLowerCase()) > -1
							: token;
					}).map((token, index, array) => {
						return (						
							<div  ref={(index === array.length - 1) ? lastElem : null} className="justify-left items-center" key={token.address} >
								<TokenDisplay showCursor={true} onSelect={onSelect} token={token}/>
							</div>
						);
					})}
			</div>
		</>
	);
};

export default TokenList;
