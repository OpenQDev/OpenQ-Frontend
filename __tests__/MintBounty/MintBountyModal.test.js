/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../test-utils';
import userEvent from '@testing-library/user-event';
import InitialState from '../../store/Store/InitialState';
import MintBountyModal from '../../components/MintBounty/MintBountyModal';
import { waitFor } from '@testing-library/react';

const issues = [
  { status: 'not-issue', url: 'asdfsadf' },
  {
    status: 'mintable',
    url: 'https://github.com/OpenQDev/OpenQ-TestRepo/issues/21',
  },
  {
    status: 'minted',
    url: 'https://github.com/OpenQDev/OpenQ-TestRepo/issues/221',
  },
  {
    status: 'unknown',
    url: 'https://github.com/OpenQDev/OpenQ-Frontend/issues/2190',
  },
];

const types = [['0'], ['1'], ['2'], ['3']];

InitialState.openQClient.shouldSleep = 200;
const test = (issue, type) => {
  it(`should handle mint interactions for type ${type[0]}`, async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<MintBountyModal types={type} />);
    // ACT
    const inputs = await screen.findAllByRole('textbox');
    await user.type(inputs[0], issues[0].url);
    await user.clear(inputs[0]);
    await user.type(inputs[0], issue.url);

    // ASSERT
    switch (issue.status) {
      case 'mintable':
        {
          expect(await screen.findByText(/mintable/i)).toBeInTheDocument();
          const mintBountyArr = await screen.findAllByText(/Deploy Contract/i);
          await user.click(mintBountyArr[2]);
        }
        break;

      case 'minted':
        {
          expect(await screen.findByText(/already minted/i)).toBeInTheDocument();
          expect(await screen.findByText(/here./)).toBeInTheDocument();
        }
        break;

      case 'unknown':
        {
          expect(await screen.findByText(/not found/i)).toBeInTheDocument();
        }
        break;

      case 'not-issue': {
        expect(await screen.findByText(/Please choose an elgible issue/i)).toBeInTheDocument();
      }
    }

    await waitFor(async () => {
      const deploy = await screen.findAllByText(/deploy/i);
      expect(deploy[0]).toBeInTheDocument();
      // should not have null or undefined values
      const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
      expect(nullish).toHaveLength(0);
    });
  });

  it(`should contain link to .sol code`, async () => {
    // ARRANGE
    render(<MintBountyModal types={type} />);
    //ASSERT
    await waitFor(() => {
      expect(screen.getByRole('link').href).toEqual(
        'https://github.com/OpenQDev/OpenQ-Contracts/blob/production/contracts/Bounty/Implementations/BountyV1.sol'
      );
    });
  });

  if (type !== '3') {
    it(`should handle extra data for type ${type[0]}`, async () => {
      // ARRANGE
      const user = userEvent.setup();
      render(<MintBountyModal types={type} />);
      // ACT
      const inputs = await screen.findAllByRole('textbox');
      await user.type(inputs[0], issue.url);
      await user.click(screen.getByRole('checkbox'));
      await user.type(screen.getByLabelText('budget'), '123assdf');
      await waitFor(async () => {
        expect(screen.getByLabelText('budget').value).toBe('123');

        // ASSERT
        switch (type[0]) {
          case '1':
            {
              await user.type(screen.getByLabelText('split'), '123assdf');
              expect(screen.getByLabelText('split').value).toBe('123');
            }
            break;

          case '2':
            {
              expect(screen.getAllByText(/place winner/)).toHaveLength(3);
              await user.type(screen.getByLabelText(/tier/), '2');
              expect(screen.getAllByText(/place winner/)).toHaveLength(32);

              /**/
            }
            break;

          case '3':
            expect(screen.getAllByText(/fixed Contest/i)).toHaveLength(4);

            break;
          default:
        }

        const deploy = screen.getAllByText(/deploy/i);
        expect(deploy[0]).toBeInTheDocument();
        // should not have null or undefined values
        const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
        expect(nullish).toHaveLength(0);
      });
    });
  }
};
describe('MintBountyModal', () => {
  issues.forEach((issue) => {
    types.forEach((type) => test(issue, type));
  });
});
