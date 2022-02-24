// Third Party
import React from 'react';

// Custom
import AboutBody from './AboutBody';

const About = ({ organizationData }) => {
	return (
		<div className='text-white grid grid-cols-wide gap-4 justify-center col-start-2 pt-12'>
			<AboutBody organizationData={organizationData} />
		</div>
	);
};
export default About;