import React, { useState, useEffect } from 'react';

const DEFAULT_BANNER = '/assets/header-banner.png';
const CUSTOM_BANNER_STORAGE_KEY = 'monkhood_custom_banner';

interface HeaderBannerProps {
  bannerUrl?: string;
  onBannerChange?: (newUrl: string) => void;
}

export const HeaderBanner: React.FC<HeaderBannerProps> = ({ 
  bannerUrl = DEFAULT_BANNER,
  onBannerChange 
}) => {
  const [currentUrl, setCurrentUrl] = useState<string>(bannerUrl);

  useEffect(() => {
    const updateBannerFromStorage = () => {
      try {
        const saved = localStorage.getItem(CUSTOM_BANNER_STORAGE_KEY);
        if (saved && (saved.startsWith('data:image/') || saved.startsWith('http') || saved.startsWith('/'))) {
          setCurrentUrl(saved);
          if (onBannerChange) onBannerChange(saved);
        } else {
          setCurrentUrl(bannerUrl);
        }
      } catch {
        setCurrentUrl(bannerUrl);
      }
    };

    updateBannerFromStorage();
    window.addEventListener('storage', updateBannerFromStorage);
    return () => window.removeEventListener('storage', updateBannerFromStorage);
  }, [bannerUrl, onBannerChange]);

  return (
    <div
      id="header-banner-container"
      className="w-full relative overflow-hidden bg-black border-b border-stone-800 rounded-t-2xl sm:rounded-t-3xl select-none"
    >
      <img
        id="header-banner-img"
        src={currentUrl}
        alt="Master Your Mind To Master Your Life - Deepanshu Bagde"
        referrerPolicy="no-referrer"
        className="w-full h-auto block select-none pointer-events-none"
      />
    </div>
  );
};


