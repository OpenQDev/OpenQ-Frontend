import React, { useEffect, useState, useContext, useRef } from 'react';
import StoreContext from '../../../../../store/Store/StoreContext';

const TierInput = ({ tier, onTierVolumeChange, style, tierVolumes }) => {
  // State
  const [suffix, setSuffix] = useState();
  const [appState] = useContext(StoreContext);
  const [reactScale, setReactScale] = useState(0.01);
  const [drag, setDrag] = useState();
  const [ogWidth, setOgWidth] = useState(0);
  const widthParent = useRef();
  const edgeOfScale = useRef();
  const tierIndex = parseInt(tier);
  const saturation = tierIndex % 2 ? 84 - tierIndex : 84 - tierIndex + 1;
  const lightness = !(tierIndex % 2) ? 48 + tierIndex : 48 + tierIndex - 1;
  const hue = 400 - tierIndex * 67;
  const handleMouseMove = (e) => {
    const tierValues = Object.values(tierVolumes);
    const totalValue = tierValues.reduce((accum, elem) => {
      return accum + elem;
    }, 0);
    if (drag) {
      const start = widthParent.current.getBoundingClientRect().x;
      const newPxWidth = (e.touches ? e.touches[0].clientX : e.clientX) - start;
      const newScale = newPxWidth / ogWidth;
      if (newScale > reactScale && totalValue >= 100) {
        const totaLNonTierValue = tierValues.reduce((accum, elem, index) => {
          if (index === parseInt(tier)) {
            return accum;
          }
          return accum + elem;
        }, 0);
        setReactScale((100 - totaLNonTierValue) / 100);
        return;
      }

      if (newScale > 0 && newScale < 1) {
        setReactScale(newScale);
      } else if (newScale > 1) {
        setReactScale(1);
      } else if (newScale <= 1) {
        setReactScale(0.01);
      }
    }
  };

  const handleDragBegin = () => {
    if (ogWidth === 0) {
      setOgWidth(widthParent.current.clientWidth);
    }
    setDrag(true);
  };

  useEffect(() => {
    handleChange(reactScale, tierVolumes);
  }, [reactScale]);
  useEffect(() => {
    let cancelled = false;
    if (edgeOfScale.current) {
      setSuffix(appState.utils.handleSuffix(parseInt(tier) + 1));

      const handleDragEnd = () => {
        if (!cancelled) {
          setDrag();
        }
      };
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchend', handleDragEnd);

      () => {
        edgeOfScale.current.removeEventListener('mousedown');
        cancelled = true;
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
      <div
        onMouseDown={handleDragBegin}
        onTouchStart={handleDragBegin}
        onTouchMove={handleMouseMove}
        onMouseMove={handleMouseMove}
        className={`flex w-11/12 text-sm content-center items-center gap-2 mb-1 ${style}`}
      >
        <div className='w-9 flex none'>{tierVolumes[tier]}%</div>
        <div ref={widthParent} className='w-full rounded-full overflow-hidden border border-transparent h-4'>
          <div
            style={{
              transform: `scaleX(${reactScale})`,
              transformOrigin: 'left center',
              backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
            }}
            data-testid={'tierInput'}
            type='textarea'
            className='resize-x w-full  h-4'
          >
            <div
              data-testid={'edgeOfScale'}
              ref={edgeOfScale}
              onMouseMove={handleMouseMove}
              style={{ transform: `scaleX(${1 / reactScale})` }}
              type='textarea'
              className='resize-x w-6 opacity-0 scale-150  h-4 float-right relative left-3 cursor-ew-resize overflow-visible'
            ></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TierInput;
