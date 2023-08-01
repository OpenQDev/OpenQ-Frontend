import React from 'react';
import { PopupButton } from '@typeform/embed-react';

const Typeform = ({ children }) => {
  return (
    <PopupButton
      id='TzsJCiRT'
      style={{
        fontSize: 18,
        padding: 0,
        border: 'transparent',
        backgroundColor: 'transparent',
        justifyContent: 'left',
      }}
    >
      {children}
    </PopupButton>
  );
};

export default Typeform;
