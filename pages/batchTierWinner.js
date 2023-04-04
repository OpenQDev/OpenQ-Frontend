import React, { useState, useContext, useEffect } from 'react';
import Papa from 'papaparse';
import StoreContext from '../store/Store/StoreContext';
import _ from 'lodash';
import tierWinnerTemplate from '../constants/tierWinnerTemplate.json';
import md4 from 'js-md4';
import Link from 'next/link';
import Image from 'next/image';
import RequestIndividualCardLean from '../components/Requests/RequestIndividualCardLean';
import { convertCsvToJson, getTierWinnerTransactions } from '../lib/batchUtils';

function BatchTierWinner() {
  const [tierWinnerBatchData, setTierWinnerBatchData] = useState(null);
  const [tierWinnerPreviewData, setTierWinnerPreviewData] = useState([]);
  const [appState] = useContext(StoreContext);
  const [file, setFile] = useState(null);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(tierWinnerBatchData));
  };

  const handleDownload = () => {
    const stringifiedJsonData = JSON.stringify(tierWinnerBatchData);
    const element = document.createElement('a');
    const file = new Blob([stringifiedJsonData], { type: 'application/json' });
    element.href = URL.createObjectURL(file);

    const textEncoder = new TextEncoder();
    const md4Digest = md4(textEncoder.encode(stringifiedJsonData));

    element.download = `tierWinnerBatchTransactions-${md4Digest.substring(0, 5)}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const loadGithubData = async (githubIssueUrl) => {
    const resource = await appState.githubRepository.fetchIssueByUrl(githubIssueUrl);
    const bountyId = resource.id;
    return { bountyId };
  };

  const loadGithubDataUser = async (githubUserUrl) => {
    const id = await appState.githubRepository.fetchUserByUrl(githubUserUrl);
    return id;
  };

  const loadGithubDataUserById = async (githubUserId) => {
    const user = await appState.githubRepository.fetchUserById(githubUserId);
    return user;
  };

  const loadOnChainBounty = async (bountyId) => {
    const bounty = await appState.openQSubgraphClient.getBountyByGithubId(bountyId);
    return bounty;
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setFile(file);
    const reader = new FileReader();

    reader.onload = async (event) => {
      const csvData = Papa.parse(event.target.result).data;

      // Convert CSV data to JSON
      const jsonData = convertCsvToJson(csvData);

      // Populate the transaction template
      let transactions = [];
      try {
        transactions = await getTierWinnerTransactions(
          jsonData,
          process.env.NEXT_PUBLIC_OPENQ_PROXY_ADDRESS,
          loadGithubData,
          loadGithubDataUser,
          loadOnChainBounty,
          appState.tokenClient
        );
      } catch (error) {
        appState.logger.error(error, 'batchTierWinner.js1');
      }

      const tierWinnerTemplateCopy = _.cloneDeep(tierWinnerTemplate);
      tierWinnerTemplateCopy.transactions = transactions;

      setTierWinnerBatchData(tierWinnerTemplateCopy);
    };

    reader.readAsText(file);
  };

  const parseTransaction = async (transaction) => {
    const { contractInputsValues } = transaction;
    const { _bountyId, _tier, _winner } = contractInputsValues;

    const githubData = await appState.githubRepository.fetchIssueById(_bountyId);
    const onChainBountyData = await loadOnChainBounty(_bountyId);
    const userData = await loadGithubDataUserById(_winner);

    return {
      payoutTokenAddress: onChainBountyData.payoutTokenAddress,
      volumeWon: onChainBountyData.payoutSchedule[_tier].toString(),
      login: userData.login,
      title: githubData.title,
      tierWon: _tier,
    };
  };

  useEffect(() => {
    const getBountyData = async () => {
      if (tierWinnerBatchData) {
        const tierWinnerPreviewData = tierWinnerBatchData.transactions.map(async (transaction) => {
          const bountyData = await parseTransaction(transaction);
          const currentTimestamp = Date.now();

          return {
            ...bountyData,
            deposits: [],
            payouts: [],
            bountyType: '3',
            bountyMintTime: currentTimestamp / 1000,
            status: '0',
          };
        });
        setTierWinnerPreviewData(await Promise.all(tierWinnerPreviewData));
      }
    };
    getBountyData();
  }, [tierWinnerBatchData]);

  return (
    <div className='flex flex-col items-center py-14'>
      <div className='w-full text-center bg-[#161B22] py-14 border-t border-web-gray'>
        <h1 className='text-2xl font-bold'>OpenQ Tier Winner Selection Batcher</h1>
        <div className='text-gray-500 text-md'>
          This is a utility to input a CSV of your bounty information and convert it to a format for upload to{' '}
          <Link
            className='hover:underline text-blue-400'
            rel='noopener norefferer'
            target='_blank'
            href='https://help.safe.global/en/articles/4680071-transaction-builder'
          >
            Gnosis Safe Transaction Builder
          </Link>
        </div>
      </div>
      <div className='flex flex-col space-y-4'>
        <h2 className='text-xl pt-8 font-bold'>Step 1: Create Your Bounty CSV</h2>
        <div>
          Copy{' '}
          <Link
            className='hover:underline text-blue-400'
            rel='noopener norefferer'
            target='_blank'
            href='https://docs.google.com/spreadsheets/d/1H0ot3Zd3XHvfpApOlQOmnDMF47o_2Zk6BblATyGT_mE/template/preview'
          >
            this Google Sheets template.
          </Link>{' '}
          To do this, simply click <b>"Use Template"</b>.
          <Image
            src='/batchPage/Use_Template_Button.png'
            width={1000}
            height={80}
            alt='use template button'
            className='mt-4'
          />
        </div>
        <h2 className='text-xl pt-8 font-bold'>Step 2: Download your Google Sheet as a CSV</h2>
        <div>File =&gt; Download =&gt; Comma Separated Values (.csv)</div>
        <Image src='/batchPage/Download_CSV.png' width={1000} height={80} alt='use template button' className='my-2' />
        <h2 className='text-xl pt-8 font-bold'>Step 3: Select your CSV file here</h2>
        <form className='flex gap-4'>
          <label className='btn-primary cursor-pointer whitespace-nowrap' htmlFor='upload'>
            {tierWinnerBatchData ? 'Update File' : 'Choose File'}
          </label>
          <input
            className='absolute invisible w-full top-0 bottom-0 z-10'
            accept='.csv'
            type='file'
            id='upload'
            onChange={handleFileUpload}
          />
          <div className='flex items-center border border-web-gray w-full font-semibold h-8 px-2 rounded-sm'>
            {file?.name}
          </div>
        </form>
        {tierWinnerBatchData && (
          <div>
            {tierWinnerBatchData === null ? (
              ''
            ) : (
              <div className='flex flex-col space-y-2'>
                <div>✅ Success!</div>
                <div>{`Now go on to the next step and download your JSON file below for these ${tierWinnerPreviewData.length} winners:`}</div>
              </div>
            )}
          </div>
        )}
        <div>
          {tierWinnerPreviewData.map((tierWinnerData, index) => {
            return (
              <RequestIndividualCardLean
                length={tierWinnerData.length}
                index={index}
                key={index}
                item={tierWinnerData}
              />
            );
          })}
        </div>

        <h2 className='text-xl pt-8 font-bold'>Step 4: Download the generated JSON file</h2>
        {tierWinnerBatchData && (
          <div className='flex flex-col'>
            <h2>If this is correct, then download the JSON file and follow the next steps.</h2>
            <div className='pt-4 flex items-center space-x-4'>
              <button className='btn-primary' onClick={handleDownload}>
                Download JSON
              </button>
              <div>OR</div>
              <button className='btn-primary' onClick={handleCopyToClipboard}>
                Copy to Clipboard
              </button>
            </div>
          </div>
        )}
        <h2 className='text-xl pt-8 font-bold'>Step 5: Navigate to the Transaction Builder Safe App</h2>
        <div>
          Go to{' '}
          <Link
            className='hover:underline text-blue-400'
            rel='noopener norefferer'
            target='_blank'
            href='https://app.safe.global'
          >
            https://app.safe.global
          </Link>
          , navigate to "Apps" and then search for <b>"Transaction Builder"</b>.
        </div>
        <div>
          For a more detailed guide on how to use the Transaction Builder, see{' '}
          <Link
            className='hover:underline text-blue-400'
            rel='noopener norefferer'
            target='_blank'
            href='https://help.safe.global/en/articles/4680071-transaction-builder'
          >
            https://help.safe.global/en/articles/4680071-transaction-builder
          </Link>
        </div>
        <h2 className='text-xl pt-8 font-bold'>
          Step 6: Drag and drop the downloaded file to the Gnosis Safe App Transaction Builder
        </h2>
      </div>
    </div>
  );
}

export default BatchTierWinner;
