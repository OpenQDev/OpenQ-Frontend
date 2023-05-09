// Third Party
import React, { useContext } from 'react';

// Custom
import StoreContext from '../../../store/Store/StoreContext';
import TokenDisplay from '../../TokenBalances/TokenDisplay';
import TokenContext from '../TokenStore/TokenContext';

const TokenList = ({ setShowTokenSearch, tokenSearchTerm, lists }) => {
  const [appState] = useContext(StoreContext);
  const [, tokenDispatch] = useContext(TokenContext);

  let fetchedTokens = [];
  if (lists.openq) {
    fetchedTokens = appState.tokenClient.openqEnumerableTokens;
  }
  if (lists.superTokens) {
    fetchedTokens = appState.tokenClient.superfluidEnumerable;
  }
  const displayTokens = fetchedTokens.filter((token) => {
    return tokenSearchTerm
      ? token.name.concat(token.symbol).concat(token.address).toLowerCase().indexOf(tokenSearchTerm.toLowerCase()) > -1
      : token;
  });

  function onSelect(token) {
    const dispatch = {
      type: 'SET_TOKEN',
      payload: token,
    };
    tokenDispatch(dispatch);

    setShowTokenSearch(false);
  }
  return (
    <>
      {/* <div style={{ padding: '25px', margin: '10px', outline: '2px solid pink', borderRadius: '20px' }} > */}

      <div>
        {displayTokens.map((token, index) => {
          return (
            <div className='justify-left items-center' key={index}>
              <TokenDisplay showCursor={true} onSelect={onSelect} token={token} />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default TokenList;
