// Third party
import React, { useState, useEffect, useContext } from 'react';
import { SafeAppConnector } from '@gnosis.pm/safe-apps-web3-react';
import Link from 'next/link';
// Custom
import StoreContext from '../../store/Store/StoreContext.js';
import ConnectButton from '../WalletConnect/ConnectButton.js';
import ProfilePicture from './ProfilePicture.js';
import Image from 'next/image';
import FirstTimeBanner from './FirstTimeBanner';
import useWeb3 from '../../hooks/useWeb3.js';
import { ThreeBarsIcon } from '@primer/octicons-react';
import LinkDropdown from '../Utils/LinkDropdown';
import { useRouter } from 'next/router';
import NavLinks from './NavLinks';
import ContractWizard from '../ContractWizard/ContractWizard';
import OpenQSocials from './OpenQSocials';
import LoadingBar from '../Loading/LoadingBar';
import LoadingThread from '../Loading/LoadingThread.js';

const Navigation = () => {
  const [gnosisSafe, setGnosisSafe] = useState();
  const [safeInfo, setSafeInfo] = useState();
  const { account, activate, deactivate } = useWeb3();
  const [appState] = useContext(StoreContext);
  const [openMenu, setOpenMenu] = useState(false);
  const [quickSearch, setQuickSearch] = useState('');
  const [items, setItems] = useState([]);
  const [searchable, setSearchable] = useState();
  const [showWizard, setShowWizard] = useState(false);
  const [loadingBar, setLoadingBar] = useState(false);
  const [changeText, setChangeText] = useState(false);
  const { bountyMinted, authService, openQSubgraphClient, openQPrismaClient, utils, githubRepository, tokenClient } =
    appState;

  const router = useRouter();
  useEffect(() => {
    if (bountyMinted) {
      setLoadingBar(true);
    }
    if (loadingBar && !bountyMinted) {
      setChangeText(true);
    }
  }, [bountyMinted]);

  useEffect(() => {
    setQuickSearch('');
    setOpenMenu(false);
  }, [router.asPath]);

  useEffect(async () => {
    if (account) {
      try {
        const response = await authService.hasSignature(account);
        if (response.data.status === false) {
          await authService.verifySignature(account, '');
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, [account]);

  useEffect(async () => {
    // set up searchable
    try {
      const subgraphOrganizations = await openQSubgraphClient.getOrganizationIds();
      const prismaContracts = await openQPrismaClient.getAllContracts();

      const githubOrganizations = await githubRepository.searchOrgOrUser(
        subgraphOrganizations.organizations.map((organization) => organization.id)
      );
      const prismaOrganizations = await openQPrismaClient.getLeanOrganizations(
        subgraphOrganizations.organizations.map((organization) => organization.id)
      );

      const subgraphBounties = await openQSubgraphClient.getBountyIds();
      const githubIssues = await githubRepository.getLeanIssueData(subgraphBounties.map((bounty) => bounty.bountyId));
      const fullOrgs = githubOrganizations
        .map((organization) => {
          const prismaOrg = prismaOrganizations.find((prismaOrganization) => {
            return prismaOrganization.id === organization.id;
          });
          return { ...organization, ...prismaOrg };
        })
        .filter((org) => !org.blacklisted);
      const fullBounties = utils
        .combineBounties(subgraphBounties, githubIssues, prismaContracts)
        .filter((bounty) => !bounty.blacklisted && !bounty.organization.blacklisted);
      const searchable = [...fullBounties, ...fullOrgs].map((searchableItem) => {
        const url = searchableItem.title
          ? `${process.env.NEXT_PUBLIC_BASE_URL}/bounty/${searchableItem.bountyId}/${searchableItem.bountyAddress}`
          : `${process.env.NEXT_PUBLIC_BASE_URL}/organization/${searchableItem.login}`;
        const name = searchableItem.name || searchableItem.title || searchableItem.login;
        const searchItemUrl = searchableItem.url;
        return {
          name: name.toLowerCase(),
          searchUrl: searchItemUrl,
          url,
          isIssue: searchableItem.title,
        };
      });
      setSearchable(searchable);
    } catch (err) {
      appState.logger.error(err, account);
    }
    // set up gnosis safe
    const safe = new SafeAppConnector();
    safe.getSafeInfo().then((data) => {
      if (data) {
        setSafeInfo(data);
        deactivate();
      }
    });
    setGnosisSafe(safe);

    // set up tokens
    let tokenPrices = {};

    try {
      tokenPrices = (await tokenClient.getPrices()) || {};
    } catch (err) {
      appState.logger.error(err, account);
    }

    tokenClient.firstTenPrices = tokenPrices;
  }, []);

  useEffect(async () => {
    if (safeInfo) {
      await activate(gnosisSafe);
    }
  }, [account]);

  const handleSearch = (e) => {
    setQuickSearch(e.target.value);

    const names = searchable
      .filter((searchableItem) => {
        return (
          searchableItem.name.includes(e.target.value.toLowerCase()) ||
          searchableItem.searchUrl.toLowerCase().includes(e.target.value.toLowerCase())
        );
      })
      .map((searchableItem) => searchableItem);
    setItems(e.target.value ? names.slice(0, 5) : []);
  };

  return (
    <div className='bg-nav-bg py-1 '>
      <FirstTimeBanner />

      <LoadingThread />

      {/* Desktop view */}

      <div className='flex visible relative'>
        <div className='flex w-full lg:py-1 justify-between mx-8'>
          <div className='flex space-x-5 items-center'>
            <Link href={'/'}>
              <a className='flex items-center lg:hover:opacity-70'>
                <Image src='/openq-logo-white-2.png' alt='OpenQ' width='31' height='31' />
              </a>
            </Link>
            <button className='flex lg:hidden' onClick={() => setOpenMenu(!openMenu)}>
              <ThreeBarsIcon size={24} />
            </button>

            <div className='lg:flex hidden  content-center  items-center'>
              <div className='flex-col justify-center mr-2 h-7 group '>
                <input
                  className={`lg:flex hidden pr-4 items-center focus:w-80 w-60  left-0 input-field transition-all  ease-in-out duration-700 ${
                    quickSearch && 'focus:w-80'
                  }`}
                  onChange={handleSearch}
                  value={quickSearch}
                  type='text'
                  placeholder='Search OpenQ'
                ></input>
                {quickSearch && <LinkDropdown items={items} />}
              </div>
              <NavLinks />
              <button onClick={() => setShowWizard(true)}>
                <div className='mx-2 text-[0.8rem] tracking-wider md:hover:text-primary text-muted font-bold hover:cursor-pointer'>
                  Contract Wizard
                </div>
              </button>
              {showWizard && <ContractWizard wizardVisibility={setShowWizard} />}
            </div>
          </div>
          <div className='flex items-center text-[0.8rem] lg:text-[1rem]'>
            <div>
              <ConnectButton />
            </div>
            <div>
              <ProfilePicture />
            </div>
          </div>
        </div>
      </div>
      {openMenu ? (
        <div className='flex lg:hidden w-full'>
          <div className='flex flex-col p-4 space-x-1 space-y-2 w-full'>
            <div className='flex-col mr-2 h-7  group'>
              <input
                className='flex pr-4 items-center input-field'
                onChange={handleSearch}
                value={quickSearch}
                type='text'
                placeholder='Search OpenQ'
              ></input>
              {quickSearch && <LinkDropdown items={items} />}
            </div>

            <NavLinks />

            <button onClick={() => setShowWizard(true)}>
              <div className='flex text-[0.8rem] pt-1 border-t border-gray-700 tracking-wider text-nav-text font-bold'>
                Contract Wizard
              </div>
            </button>
            {showWizard && <ContractWizard wizardVisibility={setShowWizard} />}
          </div>
        </div>
      ) : null}
      <OpenQSocials />
      {loadingBar && <LoadingBar loadingBar={setLoadingBar} changeText={changeText} />}
    </div>
  );
};

export default Navigation;
