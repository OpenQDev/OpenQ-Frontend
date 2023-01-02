import React from 'react';
import Skills from '../../../../components/User/OverviewTab/Skills';
import ShallowRenderer from 'react-test-renderer/shallow';
import Constants from '../../../../test-utils/constant';

describe('Skills', () => {
  const user = {
    ...Constants.accountData,
    devRoles: ['Junior Developer'],
    otherRoles: [''],
    languages: ['JavaScript', 'Solidity'],
    frameworks: ['React'],
  };
  it('should match DOM Snapshot', () => {
    const shallow = new ShallowRenderer();
    shallow.render(<Skills user={user} />);
    const tree = shallow.getRenderOutput();
    expect(tree).toMatchSnapshot();
  });
});
