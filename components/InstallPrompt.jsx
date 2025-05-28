// app/components/InstallPrompt.jsx
'use client';

import { useEffect, useState } from 'react';
import { X, Smartphone, Share, MoreVertical } from 'lucide-react';

export default function InstallPrompt() {
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const ua = navigator.userAgent;
    const isIOS     = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    const isAndroid = /Android/.test(ua) && /Chrome/.test(ua);

    // If neither iOS nor Android, never show
    if (!isIOS && !isAndroid) return;

    // Android: listen for beforeinstallprompt
    function onBeforeInstallPrompt(e) {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    }
    if (isAndroid) {
      window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    }

    // iOS Safari fallback
    const isSafari    = /^((?!chrome|android).)*safari/i.test(ua);
    const isStandalone =
      window.navigator.standalone === true ||
      window.matchMedia('(display-mode: standalone)').matches;

    if (isIOS && isSafari && !isStandalone) {
      setShow(true);
    }

    return () => {
      if (isAndroid) {
        window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      }
    };
  }, []);

  // If we never set show (or we're desktop) render nothing
  if (!show) return null;

  const isAndroid = !!deferredPrompt;
  const handleAndroidInstall = async () => {
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setShow(false);
  };

  return (
    <div className="fixed bottom-4 inset-x-1 flex justify-center px-4 z-50">
      <div className="relative w-full max-w-xs bg-background-foreground bg-opacity-90 dark:bg-opacity-90 p-3 rounded-xl shadow-lg">
        <button
          onClick={() => setShow(false)}
          className="absolute top-2 right-2 p-1 rounded hover:bg-foreground/10"
          aria-label="Schließen"
        >
          <X className="w-4 h-4 text-foreground" />
        </button>

        <div className="flex items-center space-x-3">
          <Smartphone className="w-5 h-5 text-foreground flex-shrink-0" />

          <div className="flex flex-col text-sm text-foreground space-y-1">
            <span>SvLeiben App installieren?</span>

            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={isAndroid ? handleAndroidInstall : undefined}
            >
              {isAndroid ? (
                <>
                  <MoreVertical className="w-5 h-5 text-foreground flex-shrink-0" />
                  <span className="underline">Zum Startbildschirm hinzufügen</span>
                </>
              ) : (
                <>
                  <Share className="w-5 h-5 text-foreground flex-shrink-0" />
                  <span>→ Zum Home-Bildschirm</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
