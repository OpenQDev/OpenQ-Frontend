import React, { useCallback } from 'react';

const AnimateIn = ({ children, direction, delay = 0, margin = '0px' }) => {
  const animateable = useCallback((node) => {
    if (node !== null) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.intersectionRatio > 0) {
              setTimeout(() => {
                entry.target.classList.add(`animate-fade-in-${direction}`);
              }, delay);
            } else {
              entry.target.classList.remove(`animate-fade-in-${direction}`);
            }
          });
        },
        { rootMargin: margin }
      );
      observer.observe(node);
    }
  }, []);

  return (
    <div className='opacity-0' ref={animateable}>
      {children}
    </div>
  );
};

export default AnimateIn;
