import React, { useState } from 'react';

const Batch = () => {
	const [sent, setSent] = useState(false);

	const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setSent(false);
  };

  return (
    <div>
			<h1>BATCH</h1>
			<input
                onChange={handleFileChange}
                disabled={sent}
                type='file'
                className='absolute invisible w-full top-0 bottom-0 z-10'
                id='file input'
              />
		</div>
  );
};
export default Batch;
