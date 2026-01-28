import React, { useState, useEffect } from 'react';
import './PerformanceMonitor.css';

const PerformanceMonitor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [metrics, setMetrics] = useState({
    fcp: 0,
    lcp: 0,
    cls: 0,
    fid: 0,
    ttfb: 0
  });

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') return;

    // Monitor performance metrics
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      if (lastEntry) {
        setMetrics(prev => ({
          ...prev,
          fcp: prev.fcp || lastEntry.loadEventEnd - lastEntry.fetchStart,
          lcp: prev.lcp || lastEntry.loadEventEnd - lastEntry.fetchStart,
          cls: prev.cls || lastEntry.loadEventEnd - lastEntry.loadEventStart,
          fid: prev.fid || lastEntry.responseStart - lastEntry.requestStart,
          ttfb: prev.ttfb || lastEntry.responseStart - lastEntry.requestStart
        }));
      }
    });

    observer.observe({ entryTypes: ['navigation'] });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'p' && e.ctrlKey && e.shiftKey) {
        setIsVisible(!isVisible);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isVisible]);

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className={`performance-monitor ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="monitor-header">
        <h3>Performance Metrics</h3>
        <button onClick={() => setIsVisible(false)}>×</button>
      </div>
      <div className="metrics-grid">
        <div className="metric">
          <span className="metric-label">FCP</span>
          <span className="metric-value">{metrics.fcp.toFixed(0)}ms</span>
        </div>
        <div className="metric">
          <span className="metric-label">LCP</span>
          <span className="metric-value">{metrics.lcp.toFixed(0)}ms</span>
        </div>
        <div className="metric">
          <span className="metric-label">CLS</span>
          <span className="metric-value">{metrics.cls.toFixed(3)}</span>
        </div>
        <div className="metric">
          <span className="metric-label">FID</span>
          <span className="metric-value">{metrics.fid.toFixed(0)}ms</span>
        </div>
        <div className="metric">
          <span className="metric-label">TTFB</span>
          <span className="metric-value">{metrics.ttfb.toFixed(0)}ms</span>
        </div>
      </div>
      <div className="monitor-footer">
        <small>Press Ctrl+Shift+P to toggle</small>
      </div>
    </div>
  );
};

export default PerformanceMonitor;
