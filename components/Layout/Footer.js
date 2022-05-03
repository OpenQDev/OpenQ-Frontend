// Third party
import React from 'react';

const Footer = () => {
	const year = new Date().getFullYear();
	return (
		<div className="footer text-tinted  flex justify-center w-full bg-black  py-2" style={{ position: 'absolute', bottom: '0px' }}>
			<div className='text-center w-full'>
				<div>These are currently unaudited contracts. OpenQ Labs assumes no responsibility or liability for any transaction errors, faults or losses which occur while minting, funding, refunding or claiming a bounty.</div>
				<h1>Copyright {year} OpenQ ©</h1>
			</div>
		</div>
	);
};

export default Footer;
