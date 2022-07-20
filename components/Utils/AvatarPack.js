// Third party 
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import ToolTip from './ToolTip';

const AvatarPack = ({ avatars }) => {
	return (
		<div className="flex flex-row-reverse relative w-min">
			{avatars && avatars.map((avatar) => {
				return <div key={avatar.login} className="w-3">
					<ToolTip customOffsets={[0, 60]} toolTipText={avatar.login}>
						<div className='h-8 w-8 rounded-full bg-black cursor-pointer overflow-hidden position relative hover:z-10 z-0 hover:border-pink-500 hover:border-2 border-2 border-transparent'>
							<Link href={avatar.url}><Image height={32} width={32} src={avatar.avatarUrl} />
							</Link>
						</div>
					</ToolTip>
				</div>;
			})
			}
		</div>
	);
};

export default AvatarPack;