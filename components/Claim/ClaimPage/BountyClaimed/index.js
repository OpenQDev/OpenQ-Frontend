import React, { useContext, useEffect, useRef } from 'react';
import { getWinningPrOfUser } from '../../../../services/utils/lib';
import SubmissionCard from '../../../Submissions/SubmissionCard';
import StoreContext from '../../../../store/Store/StoreContext';
import confetti from 'canvas-confetti';

const BountyClaimed = ({ bounty, justClaimed }) => {
  const [appState] = useContext(StoreContext);
  const { accountData } = appState;
  const { github } = accountData;
  const canvas = useRef(null);
  const currentPr = getWinningPrOfUser(bounty, github);
  useEffect(() => {
    if (!justClaimed) return;
    try {
      canvas.current.width = window.innerWidth;
      canvas.current.height = window.innerHeight;

      const canvasConfetti = confetti.create(canvas.current, {
        resize: true,
        useWorker: true,
      });
      canvasConfetti({
        particleCount: 200,
        spread: window.innerWidth + 400,
        origin: {
          x: 1,
          y: 0,
        },
      });
    } catch (e) {
      appState.logger.info(e);
    }
  }, [currentPr, justClaimed]);
  return (
    <>
      <div className='bg-info border  border-info-strong p-4 my-4 mb-6 rounded-sm'>
        Congratulations on winning this bounty! Your share of the funds deposited on this bounty have been sent to your
        wallet.
      </div>
      <div className='w-full flex justify-center justify-items-center'>
        <SubmissionCard pr={currentPr} bounty={bounty} refreshBounty={() => {}} />
      </div>
      <canvas className='absolute inset-0 pointer-events-none' ref={canvas}></canvas>
    </>
  );
};

export default BountyClaimed;
