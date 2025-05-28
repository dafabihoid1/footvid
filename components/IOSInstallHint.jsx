// app/components/IOSInstallHint.jsx
'use client';
import { useEffect, useState } from 'react';

export default function IOSInstallHint() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
    // standalone check: for iOS 13+ and older
    const isStandalone =
      window.navigator.standalone === true ||
      window.matchMedia('(display-mode: standalone)').matches;

    if (isIOS && isSafari && !isStandalone) {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white p-3 rounded-xl shadow-lg max-w-xs text-center text-sm z-50">
      📱 To install this app on your iPhone:
      <br />
      1️⃣ Tap the <strong>Share</strong> button in Safari’s toolbar  
      2️⃣ Scroll and tap <strong>Add to Home Screen</strong>
      <button
        className="block mt-2 text-blue-600 underline"
        onClick={() => setShow(false)}
      >
        Dismiss
      </button>
    </div>
  );
}
