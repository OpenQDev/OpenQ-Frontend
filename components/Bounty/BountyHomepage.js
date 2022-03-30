// Third Party
import React from 'react';

// Custom
import BountyList from './BountyList';
import GithubDown from '../Utils/GithubDown';

const BountyHomepage = ({ bounties, loading, complete, getMoreData, getNewData, githubOutage }) => {

	// Render
	return (
		<div className="xl:grid sm:grid px-4 xl:grid-cols-wide justify-center">
			{githubOutage?
				<GithubDown/>
				:
				<BountyList bounties={bounties}  loading={loading} getMoreData={getMoreData} complete={complete} getNewData={getNewData} />
			}
		</div>
	);
};

export default BountyHomepage;