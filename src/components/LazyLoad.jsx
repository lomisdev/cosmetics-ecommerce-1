import React, { useState, useEffect, useRef } from 'react';

const LazyLoad = ({ 
  children, 
  fallback = null, 
  rootMargin = '100px',
  threshold = 0.1
}) => {
  const [hasLoaded, setHasLoaded] = useState(false);
  const elementRef = useRef();

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setHasLoaded(true);
        }
      },
      {
        rootMargin,
        threshold
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [rootMargin, threshold, hasLoaded]);

  return (
    <div ref={elementRef} className="lazy-load-container">
      {hasLoaded ? children : fallback}
    </div>
  );
};

export default LazyLoad;
