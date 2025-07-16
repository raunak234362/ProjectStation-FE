import { useEffect, useState } from 'react';

const InstallPWAButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault(); // Prevent automatic prompt
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    if (choiceResult.outcome === 'accepted') {
      console.log('✅ User accepted the install prompt');
    } else {
      console.log('❌ User dismissed the install prompt');
    }

    setShowInstallButton(false);
    setDeferredPrompt(null);
  };

  return (
    showInstallButton && (
      <button
        onClick={handleInstallClick}
        className="fixed bottom-4 right-4 px-4 py-2 bg-blue-600 text-white rounded shadow-lg z-50"
      >
        📲 Install App
      </button>
    )
  );
};

export default InstallPWAButton;
