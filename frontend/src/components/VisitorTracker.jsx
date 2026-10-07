import React, { useEffect, useRef, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

// Helper to get or generate anonymous visitor ID
const getVisitorId = () => {
  try {
    let vid = localStorage.getItem('ascension_visitor_id');
    if (!vid) {
      vid = 'v_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36);
      localStorage.setItem('ascension_visitor_id', vid);
    }
    return vid;
  } catch (e) {
    return 'v_anonymous_' + Date.now().toString(36);
  }
};

const VisitorTracker = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext) || {};
  const lastTrackedPath = useRef('');

  const sendTrackingPing = async (path, title) => {
    try {
      const visitorId = getVisitorId();
      await axios.post('/api/analytics/track', {
        visitorId,
        pagePath: path || window.location.pathname,
        pageTitle: title || document.title || 'Ascension Page',
        referrer: document.referrer || '',
        userId: user?._id || null,
        userName: user?.name || null,
        userEmail: user?.email || null
      });
    } catch (err) {
      // Silently fail without interrupting user experience
    }
  };

  // Track page navigation
  useEffect(() => {
    const currentPath = location.pathname + location.search;
    if (lastTrackedPath.current !== currentPath) {
      lastTrackedPath.current = currentPath;
      // Small timeout to allow document.title to update
      const timer = setTimeout(() => {
        sendTrackingPing(currentPath, document.title);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, location.search, user?._id]);

  // Keep heartbeat alive every 2 minutes while user stays on site
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        sendTrackingPing(location.pathname + location.search, document.title);
      }
    }, 120000); // 2 minutes

    return () => clearInterval(interval);
  }, [location.pathname, user?._id]);

  return null;
};

export default VisitorTracker;
