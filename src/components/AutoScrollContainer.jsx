import React, { useEffect, useRef } from 'react';

const AutoScrollContainer = ({ children }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom of the container when it is updated
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [children]);

  return (
    <div ref={containerRef} style={{ overflowY: 'scroll', maxHeight: '1000px' }}>
      {children}
    </div>
  );
};

export default AutoScrollContainer;
