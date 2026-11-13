'use client';
import { useEffect } from 'react';

export default function Splash({ onDone }) {
  useEffect(() => {
    const handleMessage = (e) => {
      if (e.origin === window.location.origin && e.data === 'pisphere:promo-done') {
        onDone();
      }
    };
    window.addEventListener('message', handleMessage);
    const safetyTimer = setTimeout(onDone, 7000);
    return () => {
      window.removeEventListener('message', handleMessage);
      clearTimeout(safetyTimer);
    };
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#05050A]">
      <iframe
        src="/promo.html"
        title="PiSphere Promo"
        className="w-full h-full border-0"
      />
    </div>
  );
}
