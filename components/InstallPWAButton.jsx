'use client';

import { useEffect, useState } from 'react';

export default function InstallPWAButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    function handler(e) {
      // Prevent Chrome’s mini-info bar from appearing
      e.preventDefault();
      // Save the event for later
      setDeferredPrompt(e);
    }

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  // If the browser never fired beforeinstallprompt, don’t render anything
  if (!deferredPrompt) return null;

  const handleClick = async () => {
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond
    const { outcome } = await deferredPrompt.userChoice;
    console.log('User choice:', outcome); // “accepted” or “dismissed”
    // We can’t prompt again
    setDeferredPrompt(null);
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg"
    >
      Install App
    </button>
  );
}