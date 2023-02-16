import React, { useReducer, useContext } from 'react';
import MintReducer from './MintReducer.js';
import MintContext from './MintContext';
import InitialState from './InitialMintState.js';
import StoreContext from '../../store/Store/StoreContext';

const MintProvider = ({ children, types }) => {
  const [appState] = useContext(StoreContext);
  let category = appState.utils.getBountyTypeName({ bountyType: types[0] });
  if (category === 'Contest') category = 'Fixed Contest';
  const [state, dispatch] = useReducer(MintReducer, { category, ...InitialState });

  return <MintContext.Provider value={[state, dispatch]}>{children}</MintContext.Provider>;
};

export default MintProvider;
