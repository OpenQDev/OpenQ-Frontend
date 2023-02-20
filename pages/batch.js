import React, { useState, useContext } from 'react';
import Papa from 'papaparse';
import { ethers } from 'ethers';
import StoreContext from '../store/Store/StoreContext';
import _ from 'lodash';
import mintBountyTemplate from '../constants/mintBountyTemplate.json';
import mintBountyTransactionTemplate from '../constants/mintBountyTransactionTemplate.json';
import md4 from 'js-md4';
import Link from 'next/link';
import Image from 'next/image';

function Batch() {
  const [mintBountyBatchData, setMintBountyBatchData] = useState(null);

  const [appState] = useContext(StoreContext);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(mintBountyBatchData));
  };

  const handleDownload = () => {
    const stringifiedJsonData = JSON.stringify(mintBountyBatchData);
    const element = document.createElement('a');
    const file = new Blob([stringifiedJsonData], { type: 'application/json' });
    element.href = URL.createObjectURL(file);

    const textEncoder = new TextEncoder();
    const md4Digest = md4(textEncoder.encode(stringifiedJsonData));

    element.download = `mintBountyBatchTransactions-${md4Digest.substring(0, 5)}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  let abiCoder = new ethers.utils.AbiCoder();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async (event) => {
      const csvData = Papa.parse(event.target.result).data;

      // Convert CSV data to JSON
      const headers = csvData[0];
      const rows = csvData.slice(1);
      const jsonData = rows.map((row) => {
        const jsonObject = {};
        row.forEach((cell, index) => {
          jsonObject[headers[index]] = cell;
        });
        return jsonObject;
      });

      // Populate the transaction template
      const transactions = [];
      for (const transactionData of jsonData) {
        const {
          githubIssueUrl,
          githubSponsorUrl,
          payoutSchedule,
          payoutTokenAddress,
          invoiceRequired,
          kycRequired,
          supportingDocumentsRequired,
        } = transactionData;

        const payoutScheduleParsed = JSON.parse(payoutSchedule);

        // Fetch Github Issue ID and Organization ID
        const resource = await appState.githubRepository.fetchIssueByUrl(githubIssueUrl);
        const githubSponsorResource = await appState.githubRepository.getOrgByUrl(githubSponsorUrl);

        const bountyId = resource.id;
        const organizationId = resource.repository.owner.id;

        const sponsorOrganizationName = githubSponsorResource.login;
        const sponsorOrganizationLogo = githubSponsorResource.avatarUrl;

        // Overwrite contractInputsValues on mintBountyTransactionTemplate
        const mintBountyTransactionTemplateCopy = _.cloneDeep(mintBountyTransactionTemplate);

        mintBountyTransactionTemplateCopy.contractInputsValues._bountyId = bountyId;
        mintBountyTransactionTemplateCopy.contractInputsValues._organization = organizationId;

        const initializationSchema = ['uint256[]', 'address', 'bool', 'bool', 'bool', 'string', 'string', 'string'];
        const initializationData = [
          payoutScheduleParsed,
          payoutTokenAddress,
          invoiceRequired,
          kycRequired,
          supportingDocumentsRequired,
          '63da6f261d7d7b7cad0bc19d', // # TODO this should be the externalUserId of the currently logged in User
          sponsorOrganizationName,
          sponsorOrganizationLogo,
        ];

        const tieredFixedEncoded = abiCoder.encode(initializationSchema, initializationData);
        let tieredFixed = [3, `\"${tieredFixedEncoded}\"`];

        mintBountyTransactionTemplateCopy.contractInputsValues._initOperation = `[${tieredFixed}]`;

        const mintBountyTransactionTemplateEscaped = addEscapedQuotes(mintBountyTransactionTemplateCopy);

        transactions.push(mintBountyTransactionTemplateEscaped);
      }

      const mintBountyTemplateCopy = _.cloneDeep(mintBountyTemplate);
      mintBountyTemplateCopy.transactions = transactions;

      setMintBountyBatchData(mintBountyTemplateCopy);
    };

    reader.readAsText(file);
  };

  function addEscapedQuotes(json) {
    const contractInputs = json['contractInputsValues'];
    for (const key in contractInputs) {
      if (key === '_initOperation') {
        continue;
      }
      contractInputs[key] = JSON.stringify(contractInputs[key]);
    }
    return json;
  }

  return (
    <div className='flex flex-col items-center py-14'>
      <div className='w-full text-center bg-[#161B22] py-14 border-t border-web-gray'>
        <h1 className='text-2xl font-bold'>OpenQ Mint Bounty Batcher</h1>
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
            href='https://docs.google.com/spreadsheets/d/1JpJ6xj278Cirez9hldCmUDWlE3ZzwEoFX4kNfNC1oSE/template/preview'
          >
            this Google Sheets template.
          </Link>{' '}
          Simply click <b>"Use Template"</b>
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
        <h2 className='text-xl pt-8 font-bold'>Step 3: Choose File here and select your CSV file</h2>
        {/* <label className='btn-primary w-fit' htmlFor='upload'>
          Choose File
        </label> */}
        <input
          /* className='absolute invisible w-full top-0 bottom-0 z-10' */
          type='file'
          id='upload'
          onChange={handleFileUpload}
        />
        {mintBountyBatchData && (
          <div>
            {mintBountyBatchData === null ? (
              ''
            ) : (
              <>
                <div>✅ Success!</div>
                <div>Now go on to the next step and download your JSON file below:</div>
              </>
            )}
          </div>
        )}
        <h2 className='text-xl pt-8 font-bold'>Step 4: Download the generated JSON file</h2>
        {mintBountyBatchData && (
          <div className='flex flex-col'>
            <h2>
              You will use the Gnosis Safe Transaction Builder JSON to mint {mintBountyBatchData.transactions.length}{' '}
              bounties.
              <br />
              If this is correct, then dowlaod the JSON file and follow the next steps.
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
          , navigate to Apps. Search for <b>"Transaction Builder"</b>
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

export default Batch;
