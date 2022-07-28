// Third party
import React from 'react';

// Custom
import BountyList from '../BountyList/BountyList';
import UnexpectedError from '../Utils/UnexpectedError';

const BountyHomepage = ({
	bounties,
	watchedBounties,
	loading,
	complete,
	getMoreData,
	getNewData,
	error,
}) => {
	// Render
	return (
		<div>
			<div className="text-center bg-[#161B22] py-14 ">
				<div className="text-2xl font-bold">Explore Issues</div>
				<div className="text-gray-500 text-md">GitHub issues backed by OpenQ escrows.</div>
			</div>
    	<div className="lg:grid lg:grid-cols-extra-wide mx-4 sm:mx-8 xl:grid-cols-wide justify-center md:pr-3">
				{error ? (
					<UnexpectedError />
				) : (
					<BountyList
						bounties={bounties}
						watchedBounties={watchedBounties}
						addCarousel={true}
						loading={loading}
						getMoreData={getMoreData}
						complete={complete}
						getNewData={getNewData}
					/>
				)}
			</div>
		</div>
	);
};

export default BountyHomepage;
