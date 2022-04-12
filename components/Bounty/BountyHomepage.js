// Third Party
import React from 'react';

// Custom
import BountyList from './BountyList';
import UnexpectedError from '../Utils/UnexpectedError';

const BountyHomepage = ({ bounties, loading, complete, getMoreData, getNewData, error }) => {

	// Render
	return (
		<div className="lg:grid lg:grid-cols-extra-wide mx-8 xl:grid-cols-wide justify-center">
			{error?
				<UnexpectedError/>
				:
				<BountyList bounties={bounties}  loading={loading} getMoreData={getMoreData} complete={complete} getNewData={getNewData} />
			}
		</div>
	);
};

export default BountyHomepage;