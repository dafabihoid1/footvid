// app/components/IOSInstallPrompt.jsx
"use client";

import { useEffect, useState } from "react";
import { Share, X, Smartphone } from "lucide-react";

export default function InstallPrompt() {
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    // 1️⃣ Android: catch the beforeinstallprompt event
    function onBeforeInstallPrompt(e) {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);

    // 2️⃣ iOS Safari fallback
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
    const isStandalone =
      window.navigator.standalone === true ||
      window.matchMedia('(display-mode: standalone)').matches;

    if (isIOS && isSafari && !isStandalone) {
      setShow(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    };
  }, []);

  if (!show) return null;

  const handleAndroidInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log('User choice:', outcome);
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

          <span className="flex items-center space-x-2">
            <Share className="w-5 h-5 text-foreground flex-shrink-0" />
            <span>→  {"\u00A0"}Zum Home-Bildschirm</span>
          </span>

          <span></span>
        </div>
      </div>
    </div>
  </div>
);
}
