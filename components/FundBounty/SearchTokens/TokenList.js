// Third Party
import React, { useContext, useState, useCallback , useRef, useEffect} from 'react';

// Custom
import StoreContext from '../../../store/Store/StoreContext';
import TokenDisplay from  '../../TokenBalances/TokenDisplay';

const TokenList = ({ onCurrencySelect, setShowTokenSearch,  tokenSearchTerm, customTokens, polygonDefaultTokens, openqDefaultTokens,  currentCursor, lists }) => {
	const [appState] = useContext(StoreContext);
	const [polygonTokens, setPolygonTokens] = useState(polygonDefaultTokens);
	const [isComplete, setIsComplete] = useState(false);
	const batch = 50;
	const [cursor, setCursor] = useState(currentCursor);
	
	let fetchedTokens=customTokens;
	if(lists.openq){
		const openqTokens = openqDefaultTokens.filter((token)=>!fetchedTokens.some((displayToken)=>displayToken.address.toLowerCase()===token.address.toLowerCase()));
		fetchedTokens=fetchedTokens.concat(openqTokens);
	}
	if(lists.polygon){
		fetchedTokens=fetchedTokens.concat(polygonTokens.filter((token)=>!fetchedTokens.some((displayToken)=>displayToken.address.toLowerCase()===token.address)));
	
	}

	const displayTokens = fetchedTokens.filter((token) => {
		return tokenSearchTerm
			? token.name.concat(token.symbol).concat(token.address)
				.toLowerCase()
				.indexOf(tokenSearchTerm.toLowerCase()) > -1
			: token;
	});

	const getMoreData = async()=>{
		setIsComplete(true);
		const newPolygonTokens = await appState.tokenClient.getTokenMetadata(cursor, batch, 'polygon');
		setCursor(batch+cursor);
		setPolygonTokens([...polygonTokens, ...newPolygonTokens]);
		if(newPolygonTokens.length===batch){
			setIsComplete(false);

		}
	};

	const observer = useRef();

	const lastElem = useCallback((node)=>{
		if (observer.current) { observer.current.disconnect(); }
		if (node) {
			let options = {
				rootMargin: '1200px',
				threshold: .1
			};
			const callback = (entries) => {
				if (entries[0].isIntersecting  && !isComplete && lists.polygon) {
					getMoreData();
				}

			};
			observer.current = new IntersectionObserver(callback, options);
			observer.current.observe(node);
		}
	}
	);

	useEffect(()=>{
		if(displayTokens.length===0 && !isComplete && lists.polygon){
			getMoreData();
		}
	}, [tokenSearchTerm]);

	function onSelect(token) {
		onCurrencySelect(token);
		setShowTokenSearch(false);
	}

	return (
		<>
			{/* <div style={{ padding: '25px', margin: '10px', outline: '2px solid pink', borderRadius: '20px' }} > */}

			<div className="pt-4 ">
				{
					displayTokens.map((token, index, array) => {
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
