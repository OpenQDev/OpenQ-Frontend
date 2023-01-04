/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../../../test-utils';
import EnableRegistration from '../../../../components/MintBounty/MintBountyModal/AddContestParams/EnableRegistration';
import InitialMintState from '../../../../components/MintBounty/InitialMintState';
import MintContext from '../../../../components/MintBounty/MintContext';
import userEvent from '@testing-library/user-event';

//const mockTierVolumeChange = jest.fn();
describe('Enable Registration', () => {
  const currentDate = new Date('01-01-2023');
  it('should fire event', async () => {
    // ARRANGE
    const mintState = {
      ...InitialMintState.mintState,
      startDate: currentDate,
      enableRegistration: true,
    };
    const mintDispatch = jest.fn();

    const user = await userEvent.setup();
    render(
      <MintContext.Provider value={[mintState, mintDispatch]}>
        <EnableRegistration />
      </MintContext.Provider>
    );

    // ACT
    await user.click(screen.getByLabelText(/Enable Hackathon Registration/));

    // ASSERT
    expect(mintDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_ENABLE_REGISTRATION',
      payload: false,
    });
    // expect startdate to be in input
  });

  it('should display inputs', async () => {
    // ARRANGE
    const mintState = {
      ...InitialMintState.mintState,
      startDate: currentDate,
      enableRegistration: true,
    };
    const mintDispatch = jest.fn();

    const { asFragment } = render(
      <MintContext.Provider value={[mintState, mintDispatch]}>
        <EnableRegistration />
      </MintContext.Provider>
    );

    // ASSERT
    expect(asFragment()).toMatchSnapshot();
  });
});
