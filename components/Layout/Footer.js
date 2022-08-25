// Third party
import React from 'react';

// Custom
import CopyAddressToClipboard from '../Copy/CopyAddressToClipboard';

const Footer = () => {
	const year = new Date().getFullYear();
	return (
		<div className="text-primary text-sm bottom-0 w-full bg-nav-bg py-2 flex flex-col lg:flex-row w-full justify-between content-center font-semibold text-muted" >
			<div className="flex-row lg:flex flex-wrap lg:flex-nowrap justify-between items-center justify-between w-full lg:px-12 px-4">
				<div className='flex-0 border-web-gray lg:border-none border-b py-2'>Copyright {year} OpenQ ©</div>
				<div className='border-web-gray lg:border-none border-b py-2'>Contracts currently not audited, please use at your own risk.</div>
				<div className='flex flex-wrap gap-6 items-center justify-content-between w-full lg:w-fit text-right py-2'>
					<div className='min-w-[100px] flex gap-4'>
						<span>	Smart Contracts</span>
					</div>
					<div>
						<CopyAddressToClipboard clipping={[5, 38]} data={process.env.NEXT_PUBLIC_OPENQ_PROXY_ADDRESS} styles="pt-0 w-64" />
					
						<CopyAddressToClipboard clipping={[5, 38]} data={process.env.NEXT_PUBLIC_DEPOSIT_MANAGER_PROXY_ADDRESS} styles="pt-0 w-64" />
					
					</div>
				</div>
			</div>
		</div>);
};

export default Footer;
