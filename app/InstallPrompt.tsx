"use client";

import { useEffect, useState } from "react";

const DISMISS_KEY = "soulmate-install-dismissed";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY)) return;

    // Already installed / running standalone? Don't nag.
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    if (standalone) return;

    const ua = window.navigator.userAgent;
    const iOS = /iPhone|iPad|iPod/.test(ua);
    setIsIOS(iOS);

    if (iOS) {
      // iOS Safari has no programmatic install prompt -- show instructions instead.
      setVisible(true);
      return;
    }

    function onBeforeInstall(e: Event) {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    }
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  }

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setVisible(false);
    localStorage.setItem(DISMISS_KEY, "1");
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto">
      <div className="bg-white border border-cardLine rounded-2xl shadow-lg shadow-pink-200 p-4 flex items-center gap-3">
        <div className="text-3xl">🔮</div>
        <div className="flex-1 text-sm">
          <div className="font-bold text-ink">Add Soulmate Score to your home screen</div>
          {isIOS ? (
            <div className="text-inkSoft text-xs mt-0.5">
              Tap the Share icon, then "Add to Home Screen"
            </div>
          ) : (
            <div className="text-inkSoft text-xs mt-0.5">Full-screen, app-like experience</div>
          )}
        </div>
        {!isIOS && (
          <button
            onClick={install}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-accent to-accent2 text-white text-xs font-bold whitespace-nowrap"
          >
            Install
          </button>
        )}
        <button onClick={dismiss} className="text-inkSoft text-lg leading-none px-1" aria-label="Dismiss">
          &times;
        </button>
      </div>
    </div>
  );
}
