import React, { useState, useContext, useEffect } from 'react';
import { ethers } from 'ethers';
import Papa from 'papaparse';
import StoreContext from '../store/Store/StoreContext';
import _ from 'lodash';
import supportingDocumentsCompleteTemplate from '../constants/supportingDocumentsCompleteTemplate.json';
import md4 from 'js-md4';
import Link from 'next/link';
import Image from 'next/image';
import { convertCsvToJson, getSetSupportingDocumentsCompleteTransactions } from '../lib/batchUtils';
import RequestIndividualCardLean from '../components/Requests/RequestIndividualCardLean';

function BatchSetSupportingDocumentsComplete() {
  const [supportingDocsCompleteBatchData, setSupportingDocsCompleteBatchData] = useState(null);
  const [supportingDocsCompletePreviewData, setSupportingDocsCompletePreviewData] = useState([]);
  const [appState] = useContext(StoreContext);
  const [file, setFile] = useState(null);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(supportingDocsCompleteBatchData));
  };

  const handleDownload = () => {
    const stringifiedJsonData = JSON.stringify(supportingDocsCompleteBatchData);
    const element = document.createElement('a');
    const file = new Blob([stringifiedJsonData], { type: 'application/json' });
    element.href = URL.createObjectURL(file);

    const textEncoder = new TextEncoder();
    const md4Digest = md4(textEncoder.encode(stringifiedJsonData));

    element.download = `supportingDocumentsCompleteBatchTransactions-${md4Digest.substring(0, 5)}.json`;
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
        transactions = await getSetSupportingDocumentsCompleteTransactions(
          jsonData,
          process.env.NEXT_PUBLIC_OPENQ_PROXY_ADDRESS,
          loadGithubData,
          loadGithubDataUser,
          loadOnChainBounty
        );
      } catch (error) {
        appState.logger.error(error, 'batchSetDocumentsComplete.js1');
      }

      const supportingDocumentsCompleteTemplateCopy = _.cloneDeep(supportingDocumentsCompleteTemplate);
      supportingDocumentsCompleteTemplateCopy.transactions = transactions;

      setSupportingDocsCompleteBatchData(supportingDocumentsCompleteTemplateCopy);
    };

    reader.readAsText(file);
  };

  const parseTransaction = async (transaction) => {
    const { contractInputsValues } = transaction;
    const { _bountyId, _data } = contractInputsValues;

		const abiCoder = new ethers.utils.AbiCoder();
		const decodedData = abiCoder.decode(['uint256', 'bool'], _data);
		const tier = decodedData[0];

    const githubData = await appState.githubRepository.fetchIssueById(_bountyId);
		const { tierWinners, payoutTokenAddress, payoutSchedule } = await loadOnChainBounty(_bountyId);
		
		const userId = tierWinners[tier]
		const user = await appState.githubRepository.fetchUserById(userId);

		const volumeWon = payoutSchedule[tier].toString()
		console.log('volumeWon', volumeWon)

    return {
      ...githubData,
      tierWon: tier.toString(),
			volumeWon,
			payoutTokenAddress,
      ...user,
    };
  };

  useEffect(() => {
    const getBountyData = async () => {
      if (supportingDocsCompleteBatchData) {
        const bounties = supportingDocsCompleteBatchData.transactions.map(async (transaction) => {
          const bountyData = await parseTransaction(transaction);
					console.log('bountyData', bountyData)
          return bountyData;
        });
        setSupportingDocsCompletePreviewData(await Promise.all(bounties));
      }
    };
    getBountyData();
  }, [supportingDocsCompleteBatchData]);

  return (
    <div className='flex flex-col items-center py-14'>
      <div className='w-full text-center bg-[#161B22] py-14 border-t border-web-gray'>
        <h1 className='text-2xl font-bold'>OpenQ Tax Form Acceptance Batcher</h1>
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
            href='https://docs.google.com/spreadsheets/d/1NbFGCVn0xkz2LGzk_pTzLoZ223D2lQ0T8Z4A9osoSo0/template/preview'
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
            {supportingDocsCompleteBatchData ? 'Update File' : 'Choose File'}
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
        {supportingDocsCompleteBatchData && (
          <div>
            {supportingDocsCompleteBatchData === null ? (
              ''
            ) : (
              <div className='flex flex-col space-y-2'>
                <div>✅ Success!</div>
                <div>Now go on to the next step and download your JSON file below:</div>
              </div>
            )}
          </div>
        )}

        <h2 className='text-xl pt-8 font-bold'>Step 4: Download the generated JSON file</h2>
        {supportingDocsCompleteBatchData && (
          <div className='flex flex-col'>
            <h2>
              You will use the Gnosis Safe Transaction Builder JSON to accept the{' '}
              {supportingDocsCompleteBatchData.transactions.length} tax documents below.
              <br />
              <div className='my-4'>
                {
                  <div>
                    {supportingDocsCompletePreviewData.map((supportingDocsCompleteDatum, index) => {
                      return (
                        <RequestIndividualCardLean
                          length={supportingDocsCompletePreviewData.length}
                          index={index}
                          key={index}
                          item={supportingDocsCompleteDatum}
                        />
                      );
                    })}
                  </div>
                }
              </div>
              <br />
              If this is correct, then download the JSON file and follow the next steps.
            </h2>
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

export default BatchSetSupportingDocumentsComplete;
