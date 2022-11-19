import React from 'react';
import EditableSocial from './EditableSocial';
import useWeb3 from '../../../hooks/useWeb3';
import Twitter from '../../svg/twitter';
import Discord from '../../svg/discord';

const UserSocials = ({ user }) => {
  // state variables
  const { account } = useWeb3();
  const isOwner = account?.toLowerCase() === user.id;

  const getTwitterUser = (url) => {
    const regexToGetTwitterUsername = /twitter.com\/(.*)/;
    const match = url.match(regexToGetTwitterUsername);
    if (match) {
      return '@'.concat(match[1]);
    }
  };
  const socials = [
    {
      name: 'twitter',
      link: user.twitter || '',
      icon: Twitter,
      parseFunction: getTwitterUser,
    },
    {
      name: 'discord',
      link: user.discord || '',
      icon: Discord,
      parseFunction: (name) => name,
    },
  ];
  return (
    <div className='px-8 py-6 pb border-t border-web-gray'>
      <h2 className='font-semibold text-lg pb-8'>Socials</h2>
      <div className='flex gap-8'>
        {socials.map((social, index) => {
          return <EditableSocial user={user} social={social} key={index} isOwner={isOwner} />;
        })}
      </div>
    </div>
  );
};

export default UserSocials;
