import React from 'react';
import SubMenu from '../../Utils/SubMenu';
import RepoTitle from '../../Bounty/RepoTitle';
import Telescope from '../../svg/telescope';
const HackathonHeading = ({ internalMenuState }) => {
  const [internalMenu, setInternalMenu] = internalMenuState;
  const githubRepository = { name: 'Name', owner: 'Owner' };
  return (
    <>
      {' '}
      <RepoTitle repo={githubRepository} />
      <SubMenu
        colour='rust'
        items={[{ name: 'View', Svg: Telescope }]}
        internalMenu={internalMenu}
        updatePage={setInternalMenu}
      />
    </>
  );
};

export default HackathonHeading;
