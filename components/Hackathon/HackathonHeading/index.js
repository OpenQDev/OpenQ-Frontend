import React from 'react';
import SubMenu from '../../Utils/SubMenu';
import RepoTitle from '../../Bounty/RepoTitle';
import Telescope from '../../svg/telescope';
import { SparkleFillIcon, TrophyIcon } from '@primer/octicons-react';
const HackathonHeading = ({ internalMenuState, githubRepository }) => {
  const [internalMenu, setInternalMenu] = internalMenuState;
  const repoInfo = { name: githubRepository.name, owner: githubRepository.owner.login };
  return (
    <>
      {' '}
      <RepoTitle repo={repoInfo} />
      <SubMenu
        colour='rust'
        items={[
          { name: 'View', Svg: Telescope },
          {
            name: 'Bounties',
            Svg: TrophyIcon,
          },
          {
            name: 'Submissionis',
            Svg: SparkleFillIcon,
          },
        ]}
        internalMenu={internalMenu}
        updatePage={setInternalMenu}
      />
    </>
  );
};

export default HackathonHeading;
