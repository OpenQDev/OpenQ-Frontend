import React, { useEffect, useState, useContext, useRef, useMemo } from 'react';
import StoreContext from '../../store/Store/StoreContext';

const TierInput = ({ tier, onTierVolumeChange, style, tierVolumes }) => {
  // State
  const [suffix, setSuffix] = useState();
  const [appState] = useContext(StoreContext);
  const createReactScale = (tierVolumes, tier) => {
    return (tierVolumes[tier] || 1) / 100;
  };
  const memoizedScale = useMemo(() => createReactScale(tierVolumes, tier), [tierVolumes, tier]);
  const [reactScale, setReactScale] = useState(memoizedScale);
  const widthParent = useRef();
  const edgeOfScale = useRef();
  const tierIndex = parseInt(tier);
  const saturation = tierIndex % 2 ? 84 - tierIndex : 84 - tierIndex + 1;
  const lightness = !(tierIndex % 2) ? 48 + tierIndex : 48 + tierIndex - 1;
  const hue = 400 - tierIndex * 67;
  useEffect(() => {
    handleChange(reactScale, tierVolumes);
  }, [reactScale]);
  useEffect(() => {
    if (edgeOfScale.current) {
      setSuffix(appState.utils.handleSuffix(parseInt(tier) + 1));
      let drag = false;
      let ogWidth = 0;
      let scale = 0;
      const handleMouseMove = (e) => {
        if (drag) {
          const start = widthParent.current.getBoundingClientRect().x;
          const newPxWidth = e.clientX - start;
          const newScale = newPxWidth / ogWidth;
          scale = newScale;
          if (newScale > 0 && newScale < 1) {
            setReactScale(scale);
          } else if (newScale > 1) {
            setReactScale(1);
          } else if (newScale <= 1) {
            setReactScale(0.01);
          }
        }
      };
      const handleDragEnd = () => {
        drag = false;
      };
      const handleDragBegin = () => {
        if (ogWidth === 0) {
          ogWidth = widthParent.current.clientWidth;
        }
        drag = true;
      };
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('mousemove', handleMouseMove);
      edgeOfScale.current.addEventListener('mousedown', handleDragBegin);

      () => {
        window.removeEventListener('mouseup');
        edgeOfScale.current.removeEventListener('mousemove');
        edgeOfScale.current.removeEventListener('mousedown');
      };
    }
  }, [widthParent.current, edgeOfScale.current]);
  const handleChange = (percentage, tierVolumes) => {
    onTierVolumeChange(
      {
        name: tier,

        target: {
          value: parseInt(percentage * 100),
        },
      },
      tierVolumes
    );
  };

  return (
    <>
      <div>{suffix} place winner</div>
      <div className={`flex w-11/12 text-sm content-center items-center gap-2 mb-1 ${style}`}>
        <div className='w-9 flex none w-full'>{tierVolumes[tier]}%</div>
        <div ref={widthParent} className='w-full rounded-full overflow-hidden border border-transparent h-4'>
          <div
            style={{
              transform: `scaleX(${reactScale})`,
              transformOrigin: 'left center',
              backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
            }}
            data-testId={'tierInput'}
            type='textarea'
            className='resize-x w-full  h-4'
          >
            <div
              ref={edgeOfScale}
              style={{ transform: `scaleX(${1 / reactScale})` }}
              type='textarea'
              className='resize-x w-6 opacity-0  h-4 float-right relative left-3 cursor-ew-resize overflow-visible'
            ></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TierInput;
