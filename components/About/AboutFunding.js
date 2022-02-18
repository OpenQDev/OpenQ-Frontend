import React from 'react';
import AboutFundingValue from './AboutFundingValues';
const AboutFunding = ({activeFunding})=>{
		
	return (<div className="w-60 pb-8">
		<dd className='font-semibold text-gray-300 text-lg pb-2'>Total Value Locked</dd>
		<dt>
			<ul>
				{activeFunding.map((elem, index) =>
					<AboutFundingValue key={index} activeFunding={[elem]} />
				)}
			</ul>
		</dt>


	</div>);
};
export default AboutFunding;