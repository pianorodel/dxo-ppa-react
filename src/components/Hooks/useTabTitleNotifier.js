import { useEffect, useRef } from 'react';

export const useTabTitleNotifier = () => {
    const originalTitle = useRef(document.title);
    const blinkInterval = useRef(null);
    const notificationCount = useRef(0);
    const lastMessage = useRef('New Notification');

    const notifyTabTitle = (message = 'New Notification') => {
        if (!document.hidden) return;

        notificationCount.current += 1;
        lastMessage.current = message;

        if (blinkInterval.current) return;

        let visible = true;
        blinkInterval.current = setInterval(() => {
            document.title = visible
                ? `(${notificationCount.current}) ${lastMessage.current}`
                : originalTitle.current;
            visible = !visible;
        }, 1000);
    };

    const resetTabTitle = () => {
        if (blinkInterval.current) {
            clearInterval(blinkInterval.current);
            blinkInterval.current = null;
        }
        notificationCount.current = 0;
        document.title = originalTitle.current;
    };

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                resetTabTitle();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            resetTabTitle();
        };
    }, []);

    return { notifyTabTitle, resetTabTitle };
};
