import React, { useCallback } from 'react';

const AnimateIn = ({ children, direction }) => {
  const animateable = useCallback((node) => {
    if (node !== null) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio > 0) {
            entry.target.classList.add(`animate-fade-in-${direction}`);
          } else {
            entry.target.classList.remove(`animate-fade-in-${direction}`);
          }
        });
      });
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
