import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export const usePWA = () => {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  useEffect(() => {
    // Check if app is installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  useEffect(() => {
    if (needRefresh) {
      setIsUpdateAvailable(true);
    }
  }, [needRefresh]);

  const update = async () => {
    await updateServiceWorker(true);
    setIsUpdateAvailable(false);
  };

  const closeUpdatePrompt = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
    setIsUpdateAvailable(false);
  };

  return {
    isInstalled,
    isUpdateAvailable,
    offlineReady,
    update,
    closeUpdatePrompt,
  };
};

