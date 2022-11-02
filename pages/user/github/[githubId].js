// Third party
import React, { useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';

// Custom
import AboutFreelancer from '../../../components/User/AboutFreelancer';
import UnexpectedErrorModal from '../../../components/Utils/UnexpectedErrorModal';
import WrappedGithubClient from '../../../services/github/WrappedGithubClient';
// import WrappedOpenQSubgraphClient from '../../../services/subgraph/WrappedOpenQSubgraphClient';
import logger from '../../../services/logger/Logger';
import useAuth from '../../../hooks/useAuth';
import StoreContext from '../../../store/Store/StoreContext';
import useWeb3 from '../../../hooks/useWeb3';
import ModalDefault from '../../../components/Utils/ModalDefault';
import LoadingIcon from '../../../components/Loading/ButtonLoadingIcon';

const account = ({ githubId, user, organizations, renderError }) => {
  // TODO => useAuth => only user can see connection and connect to different wallet
  /* const [authState] = useAuth();
  console.log(authState.githubId);
  return (
    <div className=' md:grid grid-cols-wide gap-4 justify-center col-start-2 pt-12'>
      {githubId ? (
        <section className='min-h-card rounded-lg shadow-sm col-start-2 md:border border-web-gray'>
          It works. Or does it? {account} {authState.githubId} {authState.login}
          {console.log(authState)}
        </section>
      ) : (
        <UnexpectedErrorModal error={renderError} />
      )}
    </div>
  ); */

  const [authState] = useAuth();
  const { account } = useWeb3();
  const { signedAccount } = authState;
  const [appState] = useContext(StoreContext);
  const [starredOrganizations, setStarredOrganizations] = useState([]);
  const [watchedBounties, setwatchedBounties] = useState([]);
  const [relAccount, setRelAccount] = useState(account);
  const [showModal, setShowModal] = useState(false);
  const [state, setState] = useState();

  useEffect(async () => {
    const userOffChainData = await appState.openQPrismaClient.getUser(account);
    let starredOrganizations = [];
    setwatchedBounties(userOffChainData?.watchedBounties.nodes);
    //get starred organizations.
    try {
      if (userOffChainData) {
        const subgraphOrgs = await appState.openQSubgraphClient.getOrganizationsByIds(
          userOffChainData.starredOrganizationIds
        );
        const githubOrgIds = subgraphOrgs.map((bounty) => bounty.id);
        const githubOrganizations = await appState.githubRepository.fetchOrganizationsByIds(githubOrgIds);
        starredOrganizations = githubOrganizations.map((organization) => {
          const subgraphOrg = subgraphOrgs.find((org) => {
            return org.id === organization.id;
          });

          return { ...organization, ...subgraphOrg, starred: true };
        });
        setStarredOrganizations(starredOrganizations);
      }
    } catch (err) {
      appState.logger.error(err);
    }
  }, []);

  function onInput(e) {
    if (ethers.utils.isAddress(e.target.value)) {
      const checkSummedAddress = ethers.utils.getAddress(e.target.value);
      setRelAccount(checkSummedAddress);
    }
  }

  async function associateAccounts() {
    setShowModal(true);
    setState('LOADING');
  }

  const statesFormat = {
    LOADING: {
      title: 'Associating Your Account...',
      message: 'Your wallet address is being associated with your GitHub account...',
      btn: { text: 'In Progress...', disabled: true, format: 'flex items-center btn-default cursor-not-allowed gap-2' },
    },
    CONFIRMED: {
      title: 'Account Successfully Associated!',
      message:
        'Your wallet address and GitHub account were successfully associated! \nYou can now participate in Hackathons!',
      btn: { text: 'Close', disabled: false, format: 'flex btn-default' },
      clickAction: () => setShowModal(false),
    },
  };

  const btn = showModal && (
    <div>
      <button
        onClick={statesFormat[state].clickAction}
        className={statesFormat[state].btn.format}
        disabled={statesFormat[state].btn.disabled}
      >
        {statesFormat[state].btn.text}
        {state == 'LOADING' && <LoadingIcon />}
      </button>
    </div>
  );

  return (
    <div>
      {console.log(state)}
      <div className='flex gap-4 justify-center items-center pt-6'>
        {user ? (
          <div className='flex flex-col gap-4 p-8 w-1/2'>
            <div>
              You MUST sign up with Github in order to receive prize payouts in our seasonal hackathons! Funds will be
              sent to the address you put here. You can change this at any time.
            </div>
            <div className='flex gap-4'>
              <div>Enter your wallet address:</div>
              <input
                className={'flex-1 input-field w-full'}
                id='name'
                placeholder='Enter your wallet address...'
                autoComplete='off'
                type='text'
                defaultValue={account}
                onChange={(e) => onInput(e)}
              />
            </div>
            <button className='btn-primary' onClick={associateAccounts}>
              Associate Ethereum Address to your Github {relAccount}
            </button>
            {console.log(showModal)}
            {/* <AboutFreelancer
            showWatched={account === signedAccount}
            starredOrganizations={starredOrganizations}
            watchedBounties={watchedBounties}
            user={user}
            account={account}
            organizations={organizations}
          /> */}
          </div>
        ) : (
          <UnexpectedErrorModal error={renderError} />
        )}
      </div>
      {showModal && (
        <ModalDefault
          title={statesFormat[state].title}
          footerRight={btn}
          setShowModal={setShowModal}
          resetState={setState}
        >
          {statesFormat[state].message}
        </ModalDefault>
      )}
    </div>
  );
};

export const getServerSideProps = async (context) => {
  const githubId = context.params.githubId;
  const githubRepository = new WrappedGithubClient();
  githubRepository.instance.setGraphqlHeaders();
  let renderError = '';
  let user = {};
  try {
    user = await githubRepository.instance.fetchUserById(githubId);
  } catch (err) {
    logger.error(err);
    return { props: { renderError: `${githubId} is not a valid GitHub ID.` } };
  }
  return { props: { githubId, renderError, user } };
};

export default account;
