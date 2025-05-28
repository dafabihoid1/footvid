"use client";

import { useEffect, useState } from "react";
import { X, Smartphone, Share, MoreVertical } from "lucide-react";

export default function InstallPrompt() {
    const [show, setShow] = useState(false);
   const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isAndroidOther, setIsAndroidOther] = useState(false);

    useEffect(() => {
        const ua = navigator.userAgent;
        const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
        const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
        const isStandalone =
            window.navigator.standalone === true || window.matchMedia("(display-mode: standalone)").matches;

        // Android Chrome: listen for the prompt event
        function onBeforeInstallPrompt(e) {
            e.preventDefault();
            setDeferredPrompt(e);
            setShow(true);
        }
        window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);

        
        // Android but NO prompt event = "other" browsers
        const isAndroid = /Android/.test(ua);
        if (isAndroid && !window.matchMedia("(display-mode: standalone)").matches) {
            // If Chrome didn't fire beforeinstallprompt within a tick,
            // assume it's a different Android browser
            setTimeout(() => {
                if (!deferredPrompt) {
                    setIsAndroidOther(true);
                    setShow(true);
                }
            }, 500);
        }

        // iOS Safari fallback
        if (isIOS && isSafari && !isStandalone) {
            setShow(true);
        }

        return () => {
            window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
        };
    }, [deferredPrompt]);

    if (!show) return null;

    const isAndroidChrome = !!deferredPrompt;
    const handleAndroidInstall = async () => {
        if (!deferredPrompt) return;
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

                        <div className="flex items-center space-x-2">
                            {isAndroidChrome ? (
                                // Android Chrome: native prompt
                                <>
                                    <MoreVertical
                                        className="w-5 h-5 text-foreground flex-shrink-0 cursor-pointer"
                                        onClick={handleAndroidInstall}
                                    />
                                    <button
                                        onClick={handleAndroidInstall}
                                        className="underline text-left text-foreground"
                                    >
                                        Zum Startbildschirm hinzufügen
                                    </button>
                                </>
                            ) : isAndroidOther ? (
                                // Other Android: manual instructions
                                <>
                                    <MoreVertical className="w-5 h-5 text-foreground flex-shrink-0" />
                                    <span>Tippe auf ⋮ und wähle „Zum Startbildschirm hinzufügen“</span>
                                </>
                            ) : (
                                // iOS Safari
                                <>
                                    Safari → <Share className="w-5 h-5 text-foreground flex-shrink-0" />
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
