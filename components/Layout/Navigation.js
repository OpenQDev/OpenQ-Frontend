// Third party
import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import ReactGA from 'react-ga4';
// Custom
import StoreContext from '../../store/Store/StoreContext.js';
import ConnectButton from '../WalletConnect/ConnectButton.js';
import ProfilePicture from './ProfilePicture.js';
import Image from 'next/image';
import FirstTimeBanner from './FirstTimeBanner';
import useWeb3 from '../../hooks/useWeb3.js';
import { QuestionIcon, ThreeBarsIcon } from '@primer/octicons-react';
import LinkDropdown from '../Utils/LinkDropdown';
import { useRouter } from 'next/router';
import NavLinks from './NavLinks';
import LoadingBar from '../Loading/LoadingBar';
import LoadingThread from '../Loading/LoadingThread.js';
import ContractWizard from '../ContractWizard/ContractWizard.js';

const Navigation = () => {
  const { account } = useWeb3();
  const [appState] = useContext(StoreContext);
  const [openMenu, setOpenMenu] = useState(false);
  const [quickSearch, setQuickSearch] = useState('');
  const [items, setItems] = useState([]);
  const [searchable, setSearchable] = useState();
  const [loadingBar, setLoadingBar] = useState(false);
  const [changeText, setChangeText] = useState(false);
  const [showModal, setShowModal] = useState(false);
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
    ReactGA.pageview(router.asPath);
    setQuickSearch('');
    setOpenMenu(false);
  }, [router.asPath]);

  useEffect(() => {
    const fetchSignature = async () => {
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
    };
    fetchSignature();
  }, [account]);

  useEffect(() => {
    // set up searchable
    const fetchSearch = async () => {
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
            ? `${process.env.NEXT_PUBLIC_BASE_URL}/contract/${searchableItem.bountyId}/${searchableItem.bountyAddress}`
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

      // set up tokens
      let tokenPrices = {};

      try {
        tokenPrices = (await tokenClient.getPrices()) || {};
      } catch (err) {
        appState.logger.error(err, account);
      }

      tokenClient.firstTenPrices = tokenPrices;
    };

    fetchSearch();
  }, []);

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
      <div className='flex visible relative'>
        <div className='flex w-full lg:py-1 justify-between mx-4 lg:mx-8'>
          <div className='flex space-x-5 items-center'>
            <Link href={'/'} className='flex items-center lg:hover:opacity-70'>
              <Image src='/openq-logo-white-2.png' alt='OpenQ' width='31' height='31' />
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
              <button onClick={() => setShowModal(true)} className='pl-4 flex items-center'>
                <QuestionIcon size={16} className='fill-muted hover:fill-primary' />
              </button>
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
          </div>
        </div>
      ) : null}
      {loadingBar && <LoadingBar loadingBar={setLoadingBar} changeText={changeText} />}
      {showModal && <ContractWizard wizardVisibility={setShowModal} />}
    </div>
  );
};

export default Navigation;
