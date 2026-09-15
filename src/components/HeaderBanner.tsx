import React, { useState, useEffect } from 'react';

interface HeaderBannerProps {
  bannerUrl?: string;
}

const STORAGE_KEY = 'monkhood_custom_banner';
const DEFAULT_BANNER = '/header-banner.png?v=3';

export const HeaderBanner: React.FC<HeaderBannerProps> = ({
  bannerUrl = DEFAULT_BANNER,
}) => {
  const [currentImage, setCurrentImage] = useState<string>(bannerUrl);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && (saved.startsWith('data:image/') || saved.startsWith('http') || saved.startsWith('/'))) {
        setCurrentImage(saved);
      } else {
        setCurrentImage(bannerUrl);
      }
    } catch (e) {
      setCurrentImage(bannerUrl);
    }
  }, [bannerUrl]);

  return (
    <div
      id="header-banner-container"
      className="w-full relative overflow-hidden bg-black border-b border-stone-800 rounded-t-2xl sm:rounded-t-3xl"
    >
      <img
        id="header-banner-img"
        src={currentImage}
        alt="Master Your Mind To Master Your Life - Deepanshu Bagde"
        referrerPolicy="no-referrer"
        className="w-full h-auto block select-none"
      />
    </div>
  );
};
