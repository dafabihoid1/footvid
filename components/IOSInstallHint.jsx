// app/components/IOSInstallPrompt.jsx
'use client';

import { useEffect, useState } from 'react';
import { Share2 } from 'lucide-react';

export default function IOSInstallPrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
    const isStandalone =
      window.navigator.standalone === true ||
      window.matchMedia('(display-mode: standalone)').matches;

    if (isIOS && isSafari && !isStandalone) {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 inset-x-0 flex justify-center px-4 z-50">
      <div className="flex items-center space-x-2 bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 p-3 rounded-lg shadow-lg max-w-xs">
        <Share2 className="w-5 h-5 flex-shrink-0" />
        <span className="text-sm">
          Open the Share menu, then tap <strong>Add to Home Screen</strong>.
        </span>
        <button
          onClick={() => setShow(false)}
          className="ml-2 text-sm underline"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
