import React from 'react';
import SubMenu from '../../Utils/SubMenu';
import RepoTitle from '../../Bounty/RepoTitle';
import Telescope from '../../svg/telescope';
import { GitBranchIcon } from '@primer/octicons-react';
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
            Svg: GitBranchIcon,
          },
        ]}
        internalMenu={internalMenu}
        updatePage={setInternalMenu}
      />
    </>
  );
};

export default HackathonHeading;
