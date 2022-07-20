// Third party
import React from 'react';
// Custom
import AvatarPack from '../../Utils/AvatarPack';

const UserHistory = ({organizations, payouts})=>{

	return(<div className='px-16 py-6 py-6 gap-6 border-t border-web-gray flex flex-wrap items-stretch w-full font-semibold text-gray-300 text-lg'>
		{organizations &&
				<div className='flex-1 mb-6'>
					<div className='pb-2'>Organizations</div>					
					{organizations.length===0 ?
						<div className='font-normal flex-1'>User hasn{'\''}t claimed  a bounty with any organization.</div>:
						<AvatarPack avatars={organizations} />}
				</div> }
		<div className='flex-1 whitespace-nowrap'>
			<div className='pb-2'>Bounties Collected</div>

			<div className=' text-base leading-[32px]'>{payouts.length}</div>
		</div>
	</div>);
};

export default UserHistory;