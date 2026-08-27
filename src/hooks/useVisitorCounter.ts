import { useState, useEffect } from 'react';

const STORAGE_KEY_VISITOR = 'rohkris64_visitor_count';
const STORAGE_KEY_SESSION = 'rohkris64_session_counted';

export function useVisitorCounter(baseCount = 1420) {
  const [visitorCount, setVisitorCount] = useState<number>(baseCount);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_VISITOR);
      let count = stored ? parseInt(stored, 10) : baseCount;

      // Increment once per browser session
      const sessionCounted = sessionStorage.getItem(STORAGE_KEY_SESSION);
      if (!sessionCounted) {
        count += 1;
        localStorage.setItem(STORAGE_KEY_VISITOR, count.toString());
        sessionStorage.setItem(STORAGE_KEY_SESSION, 'true');
      }

      setVisitorCount(count);
    } catch (err) {
      console.warn('LocalStorage error:', err);
    }
  }, [baseCount]);

  return visitorCount;
}
