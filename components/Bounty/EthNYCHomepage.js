// Third party
import React from 'react';

// Custom
import BountyList from './BountyList';
import UnexpectedError from '../Utils/UnexpectedError';

const EthNYCHomepage = ({ bounties, watchedBounties, loading, complete, getMoreData, getNewData, error, label }) => {

	// Render
	return (
		<div className="lg:grid lg:grid-cols-extra-wide mx-4 sm:mx-8 xl:grid-cols-wide justify-center">
			{error ?
				<UnexpectedError />
				:
				<BountyList labelProp={label} bounties={bounties} watchedBounties={watchedBounties} addCarousel={true} loading={loading} getMoreData={getMoreData} complete={complete} getNewData={getNewData} />
			}
		</div>
	);
};

export default EthNYCHomepage;