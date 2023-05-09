import React, { useState, useContext } from 'react';
import StoreContext from '../../../../../store/Store/StoreContext';
import ToolTipNew from '../../../../Utils/ToolTipNew';
import BountyAlreadyMintedMessage from '../BountyAlreadyMintedMessage';
import IssueDetailsBubble from '../IssueDetailsBubble';
import MintContext from '../../../MintContext';

const MintBountyInputIssue = () => {
  const [closed, setClosed] = useState();
  const [bountyAddress, setBountyAddress] = useState();
  const [appState] = useContext(StoreContext);
  const [mintState, mintDispatch] = useContext(MintContext);

  const { isLoading, issue } = mintState;

  const [url, setUrl] = useState('');
  const isValidUrl = appState.utils.issurUrlRegex(url);

  const setIssueUrl = async (issueUrl) => {
    if (!isLoading) {
      const dispatch = { type: 'SET_ENABLE_MINT', payload: false };
      mintDispatch(dispatch);
      let didCancel = false;
      setUrl(issueUrl);
      let issueUrlIsValid = appState.utils.issurUrlRegex(issueUrl);
      if (issueUrlIsValid && !didCancel) {
        async function fetchIssue() {
          try {
            const data = await appState.githubRepository.fetchIssueByUrl(issueUrl);
            if (!didCancel) {
              const issueDispatch = { type: 'SET_ISSUE', payload: data };
              mintDispatch(issueDispatch);
            }
            return data;
          } catch (error) {
            if (!didCancel) {
              const issueDispatch = { type: 'SET_ISSUE', payload: false };
              mintDispatch(issueDispatch);
            }
          }
        }
        const issueData = await fetchIssue();
        if (issueData) {
          try {
            let bounty = await appState.openQSubgraphClient.getBountyByGithubId(issueData.id, 'no-cache');
            if (closed === false && bounty?.status == '1' && didCancel) {
              setClosed(true);
            }
            if (!didCancel && closed === true && bounty?.status !== '1') {
              setClosed(false);
            }
            if (bounty && !didCancel) {
              setBountyAddress(bounty.bountyAddress);
            } else {
              if (!didCancel) {
                const dispatch = { type: 'SET_ENABLE_MINT', payload: true };
                mintDispatch(dispatch);
                setBountyAddress();
              }
            }
          } catch (error) {
            console.error(error);
          }
        }
      }
      return () => {
        didCancel = true;
      };
    }
  };
  return (
    <>
      <div className='flex flex-col py-2'>
        <div
          className={`flex flex-col gap-2 items-start self-start rounded-sm text-base bg-[#161B22] w-11/12 
      }`}
        >
          <div className='flex items-center gap-2 font-semibold'>
            Enter GitHub Issue URL
            <ToolTipNew
              innerStyles={'w-40 whitespace-normal'}
              toolTipText={'Enter the link to the GitHub issue you would like to fund.'}
            >
              <div className='cursor-help rounded-full border border-[#c9d1d9] aspect-square leading-4 h-4 text-sm box-content text-center font-bold text-primary'>
                ?
              </div>
            </ToolTipNew>
          </div>
          <input
            className={'flex-1 input-field w-full'}
            id='name'
            aria-label='issue url'
            placeholder='https://github.com/...'
            autoComplete='off'
            type='text'
            value={url}
            onChange={(event) => {
              setIssueUrl(event.target.value);
            }}
          />
          {isValidUrl && (
            <div className='border border-web-gray w-full rounded-sm my-1 p-3 bg-dark-mode'>
              {issue?.url?.includes('/issues/') ? <IssueDetailsBubble /> : null}
              {!issue?.url?.includes('/issues/') && <div className='flex flex-col'>Github Issue not found</div>}
              <div className='flex flex-col space-x-1'>
                {issue?.url?.includes('/issues/') && issue?.closed && !bountyAddress && (
                  <div className=''>This issue is already closed on GitHub</div>
                )}
                {bountyAddress && issue && (
                  <BountyAlreadyMintedMessage closed={closed} id={issue.id} bountyAddress={bountyAddress} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default MintBountyInputIssue;
