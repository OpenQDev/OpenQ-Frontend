// Third party
import React, {useContext} from 'react';
import Skeleton from 'react-loading-skeleton';

// Custom
import StoreContext from '../../store/Store/StoreContext';

const LabelsList = ({ bounty, isLimited }) => {
	const [appState] = useContext(StoreContext);
	const length = bounty.labels.length;

	const maxLabel = 3;

	return (
		<ul className='flex flex-wrap w-full flex-row gap-1 py-px'>
			{length < 1 ? <div className="pt-5"></div> : null}
			{!isLimited ? bounty.labels && bounty.labels.map((label, index) => {
				return (
					<li
						key={index}
						className="rounded-lg text-xs mr-2 mb-px py-px px-2 font-bold border border-purple-500  truncate inline list-style-none"
						style={{
							backgroundColor: `#${label.color}22`,
							borderColor: `#${label.color}`,
							opacity: .9,
							color: `#${appState.utils.avgcolor(label.color, 'ffffff')}`,
						}}
					>
						{label.name}
					</li>
				);
			}) ||
					<>
						<li className="rounded-lg text-xs py-1 px-2 font-bold border border-web-gray  inline list-style-none">
							<Skeleton width="10rem" height={'12px'} />
						</li>
						<li className="rounded-lg text-xs py-1 px-2 font-bold border border-web-gray  inline list-style-none">
							<Skeleton width="10rem" height={'12px'} />
						</li>
					</>
			: 
			bounty.labels && bounty.labels.slice(0,3).map((label, index) => {
				return (
					<li
						key={index}
						className="rounded-lg text-xs mr-2 mb-px py-px px-2 font-bold border border-purple-500  truncate inline list-style-none"
						style={{
							backgroundColor: `#${label.color}22`,
							borderColor: `#${label.color}`,
							opacity: .9,
							color: `#${appState.utils.avgcolor(label.color, 'ffffff')}`,
						}}
					>
						{label.name}
					</li>
				);
			})
			 ||
					<>
						<li className="rounded-lg text-xs py-1 px-2 font-bold border border-web-gray  inline list-style-none">
							<Skeleton width="10rem" height={'12px'} />
						</li>
						<li className="rounded-lg text-xs py-1 px-2 font-bold border border-web-gray  inline list-style-none">
							<Skeleton width="10rem" height={'12px'} />
						</li>
					</>
			}
		</ul>
	);
};

export default LabelsList;
