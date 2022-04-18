// Third Party
import React from 'react';

const Footer = () => {
	return (
		<div className="footer text-tinted  flex justify-center w-full bg-black  py-2 lg:mx-20" style={{ position: 'absolute', bottom: '0px' }}>
			<div className='text-center w-5/6 mx'>
				<div>These are currently unaudited contracts. OpenQ Labs assumes no responsibility or liability for any transaction errors, faults or losses which occur while minting, funding, refunding or claiming a bounty</div>
				<h1>Copyright 2021 OpenQ ©</h1>
			</div>
		</div>
	);
};

export default Footer;
