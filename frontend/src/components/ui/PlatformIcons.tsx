'use client';

import React from 'react';
import Image from 'next/image';

interface PlatformIconProps {
  platform: string;
  className?: string;
  size?: number;
}

const PlatformIcon: React.FC<PlatformIconProps> = ({ 
  platform, 
  className = "h-4 w-4", 
  size = 16 
}) => {
  const iconProps = {
    width: size,
    height: size,
    className,
  };

  switch (platform.toLowerCase()) {
    case 'netflix':
      return <Image src="/icons/netflix.svg" alt={`Icon for ${platform}`} width={size} height={size} className={className} />;
    
    case 'disney+':
    case 'disney plus':
    case 'disneyplus':
      return <Image src="/icons/disney_plus.svg" alt={`Icon for ${platform}`} width={size} height={size} className={className} />;
    
    case 'hbo max':
    case 'max':
    case 'hbomax':
      return <Image src="/icons/HBO_Max.svg" alt={`Icon for ${platform}`} width={size} height={size} className={className} />;
    
    case 'prime video':
    case 'amazon prime':
    case 'amazon':
      return <Image src="/icons/prime_video.svg" alt={`Icon for ${platform}`} width={size} height={size} className={className} />;
    
    case 'apple tv+':
    case 'apple tv':
    case 'appletv':
      return <Image src="/icons/apple-tv-plus.svg" alt={`Icon for ${platform}`} width={size} height={size} className={className} />;
    
    case 'crunchyroll':
      return <Image src="/icons/crunchyroll.svg" alt={`Icon for ${platform}`} width={size} height={size} className={className} />;
    
    case 'star+':
    case 'star plus':
    case 'starplus':
      return <Image src="/icons/star-plus.svg" alt={`Icon for ${platform}`} width={size} height={size} className={className} />;
    
    // Ícones de Jogos
    case 'playstation':
    case 'ps4':
    case 'ps5':
      return <Image src="/icons/playstation.svg" alt={`Icon for ${platform}`} width={size} height={size} className={className} />;
    
    case 'xbox':
    case 'xbox one':
    case 'xbox series':
      return <Image src="/icons/xbox.svg" alt={`Icon for ${platform}`} width={size} height={size} className={className} />;
    
    case 'nintendo switch':
    case 'nintendo':
    case 'switch':
      return <Image src="/icons/nintendo_switch.svg" alt={`Icon for ${platform}`} width={size} height={size} className={className} />;
    
    case 'steam':
      return <Image src="/icons/steam.svg" alt={`Icon for ${platform}`} width={size} height={size} className={className} />;
    
    case 'pc':
    case 'windows':
      return <Image src="/icons/pc.svg" alt={`Icon for ${platform}`} width={size} height={size} className={className} />;
    
    default:
      return (
        <div className={`${className} bg-gray-300 rounded flex items-center justify-center`}>
          <span className="text-xs font-medium text-gray-600">?</span>
        </div>
      );
  }
};

export default PlatformIcon;
