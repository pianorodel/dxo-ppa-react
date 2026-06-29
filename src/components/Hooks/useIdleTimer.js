// src/components/Hooks/useIdleTimer.js
import { useEffect, useRef, useState, useCallback } from 'react';
import { getCurrentUser } from '@/helpers/session_helper';

const useIdleTimer = ({ 
  timeout, 
  onIdle, 
  onPrompt = null,
  promptTimeout = null,
  enabled = true 
}) => {
  const [isIdle, setIsIdle] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const idleTimeoutRef = useRef(null);
  const promptTimeoutRef = useRef(null);
  const warningShownRef = useRef(false);

  const resetTimer = useCallback(() => {
    const isLoggedIn = getCurrentUser();
    if (!enabled || !isLoggedIn) return;

    // Clear existing timers
    if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    if (promptTimeoutRef.current) clearTimeout(promptTimeoutRef.current);
    
    setIsIdle(false);
    setShowPrompt(false);
    warningShownRef.current = false;

    // Set prompt timer if configured (show warning before timeout)
    if (promptTimeout && onPrompt) {
      promptTimeoutRef.current = setTimeout(() => {
        if (!warningShownRef.current) {
          setShowPrompt(true);
          warningShownRef.current = true;
          onPrompt();
        }
      }, timeout - promptTimeout);
    }

    // Set idle timer (actual timeout)
    idleTimeoutRef.current = setTimeout(() => {
      setIsIdle(true);
      if (onIdle) onIdle();
    }, timeout);
  }, [timeout, onIdle, promptTimeout, onPrompt, enabled]);

  const pauseTimer = useCallback(() => {
    if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    if (promptTimeoutRef.current) clearTimeout(promptTimeoutRef.current);
  }, []);

  const resumeTimer = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  useEffect(() => {
    const isLoggedIn = getCurrentUser();
    if (!enabled || !isLoggedIn) return;

    const events = [
      'mousedown',
      'mousemove',
      'keydown',
      'keypress',
      'scroll',
      'touchstart',
      'touchmove',
      'click',
      'wheel',
      'DOMMouseScroll',
      'mousewheel',
      'MSPointerDown',
      'MSPointerMove',
      'visibilitychange'
    ];

    const handleActivity = () => {
      // Only reset if warning hasn't been shown yet
      if (!showPrompt && !isIdle) {
        resetTimer();
      }
    };

    events.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    resetTimer();

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      if (promptTimeoutRef.current) clearTimeout(promptTimeoutRef.current);
    };
  }, [resetTimer, enabled, isIdle, showPrompt]);

  return { isIdle, showPrompt, resetTimer, pauseTimer, resumeTimer };
};

export default useIdleTimer;