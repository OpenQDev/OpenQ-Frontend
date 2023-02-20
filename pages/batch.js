import React, { useState, useContext } from 'react';
import Papa from 'papaparse';
import { ethers } from 'ethers';
import StoreContext from '../store/Store/StoreContext';
import _ from 'lodash';
import mintBountyTemplate from '../constants/mintBountyTemplate.json';
import mintBountyTransactionTemplate from '../constants/mintBountyTransactionTemplate.json';
import md4 from 'js-md4';
import Link from 'next/link';

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
    <div>
      <h1>OpenQ Mint Bounty Batcher</h1>
      <div>
        This is a utility to input a CSV of your bounty information and convert it to a format for upload to{' '}
        <Link target='_blank' href='https://help.safe.global/en/articles/4680071-transaction-builder'>
          Gnosis Safe Transaction Builder
        </Link>
      </div>
      <h2>Step 1: Create Your Bounty CSV</h2>
      <div>
        Copy{' '}
        <Link
          target='_blank'
          href='https://docs.google.com/spreadsheets/d/1JpJ6xj278Cirez9hldCmUDWlE3ZzwEoFX4kNfNC1oSE/template/preview'
        >
          this Google Sheets template.
        </Link>
        Simply click <b>Use Template</b>
      </div>
      <h2>Step 2: Download your Google Sheet as a CSV</h2>
      <div>File -&gt; Download -&gt; Comma Separated Values (.csv)</div>
      <h2>Step 3: Choose File here and select you CSV file</h2>
      <h2>Step 4: Click Submit and Download JSON</h2>
      <h2>Step 5: Navigate to the Transaction Builder Safe App</h2>
      <div>
        Go to https://app.safe.global, navigate to Apps. Search for <b>Transaction Builder</b>
      </div>
      <h2>Step 6: Drag and drop the downloaded file to the Gnosis Safe App Transaction Builder</h2>
      <input type='file' onChange={handleFileUpload} />
      {mintBountyBatchData && (
        <div>
          <h2>Gnosis Safe Transaction Builder JSON - Mint Bounty {mintBountyBatchData.transactions.length} Bounties</h2>
          <div>{mintBountyBatchData === null ? '' : '✅ Success! Download JSON below'}</div>
          <br />
          <button style={{ background: 'green' }} onClick={handleDownload}>
            Download JSON
          </button>
          <br />
          <br />
          <button style={{ background: 'green' }} onClick={handleCopyToClipboard}>
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
}

export default Batch;
