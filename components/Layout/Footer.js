// Third Party
import React from 'react';

const Footer = () => {
	return (
		<div className="footer text-tinted text-center w-full py-2 lg:mx-20 bg-black" style={{ position: 'absolute', bottom: 0 }}>
			<div>These are currently unaudited contracts. OpenQ Labs assumes no responsibility or liability for any transaction errors, faults or losses which occur while minting, funding, refunding or claiming a bounty</div>
			<h1>Copyright 2021 OpenQ ©</h1>
		</div>
	);
};

export default Footer;
