import React, { useState, useContext } from 'react';
import Papa from 'papaparse';
import { ethers } from 'ethers'
import StoreContext from '../store/Store/StoreContext';

function CsvUploader() {
  const [csvData, setCsvData] = useState([]);
  const [jsonData, setJsonData] = useState(null);

	const [appState,] = useContext(StoreContext)

	let abiCoder = new ethers.utils.AbiCoder;

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = async (event) => {
      const csvData = Papa.parse(event.target.result).data;
      setCsvData(csvData);

      // Convert CSV data to JSON
      const headers = csvData[0];
      const rows = csvData.slice(1);
      const jsonRows = rows.map((row) => {
        const jsonObject = {};
        row.forEach((cell, index) => {
          if (headers[index] === 'payoutSchedule') {
            // Remove spaces from the Payout Schedule array
            const payouts = cell.split(',').map((payout) => payout.trim()).join();
            jsonObject[headers[index]] = payouts;
          } else {
            jsonObject[headers[index]] = cell;
          }
        });
        return jsonObject;
      });
      const jsonData = JSON.stringify(jsonRows, null, 2);
      setJsonData(jsonData);

			const jsonDataParsed = JSON.parse(jsonData)

			const resource = await appState.githubRepository.fetchIssueByUrl(jsonDataParsed[0].githubIssueUrl)

			const bountyId = resource.id
			const organizationId = resource.repository.owner.id
    };

    reader.readAsText(file);
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
      {csvData.length > 0 && (
        <div>
          <h2>CSV Data</h2>
          <table>
            <thead>
              <tr>
                {csvData[0].map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {csvData.slice(1).map((row, index) => (
                <tr key={index}>
                  {row.map((cell, index) => (
                    <td key={index}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {jsonData && (
        <div>
          <h2>JSON Data</h2>
          <pre>{jsonData}</pre>
        </div>
      )}
    </div>
  );
}

export default CsvUploader;
