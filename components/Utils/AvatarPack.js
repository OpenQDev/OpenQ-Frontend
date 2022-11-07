// Third party
import React from 'react';
import Link from 'next/link';
import Image from "next/legacy/image";

import ToolTipNew from './ToolTipNew';

const AvatarPack = ({ avatars }) => {
  return (
    <div className='flex flex-row-reverse relative w-min'>
      {avatars &&
        avatars.map((avatar) => {
          return (
            <div key={avatar.login} className='w-8'>
              <ToolTipNew toolTipText={avatar.login}>
                <div className='h-8 w-8 rounded-full bg-black cursor-pointer overflow-hidden position relative hover:z-10 z-0 hover:border-gray-700 hover:border border border-transparent'>
                  <Link href={avatar.url}>
                    <a target='_blank' rel='noopener noreferrer'>
                      <Image height={32} width={32} src={avatar.avatarUrl} />
                    </a>
                  </Link>
                </div>
              </ToolTipNew>
            </div>
          );
        })}
    </div>
  );
};

export default AvatarPack;
