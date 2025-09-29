'use client';

/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import Image from 'next/image';

interface AwardIconProps {
  award: string;
  status: 'vencedor' | 'indicado';
  year?: string | number;
  className?: string;
  size?: number;
}

const AwardIcon: React.FC<AwardIconProps> = ({ 
  award, 
  status, 
  year,
  className = "h-4 w-4", 
  size = 16 
}) => {
  const isWinner = status === 'vencedor';
  
  // Gradientes CSS para vencedor e indicado
  const gradientClass = isWinner 
    ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' 
    : 'bg-gradient-to-r from-gray-300 to-gray-500';
  
  const textClass = isWinner ? 'text-yellow-900' : 'text-gray-700';
  const labelText = isWinner ? 'Vencedor' : 'Indicado';
  const displayYear = year || new Date().getFullYear();

  // Função para obter o ícone do prêmio
  const getAwardIcon = () => {
    const iconProps = {
      width: size,
      height: size,
      className: className,
      alt: `${award} icon`
    };

    switch (award.toLowerCase()) {
      case 'oscar':
      case 'academy awards':
        return <Image src="/icons/oscar.svg" {...iconProps} />;
      
      case 'globo de ouro':
      case 'golden globe':
      case 'golden globes':
        return <Image src="/icons/globo-ouro.svg" {...iconProps} />;
      
      case 'the game awards':
      case 'tga':
        return <Image src="/icons/the-game-awards.svg" {...iconProps} />;
      
      case 'the anime awards':
      case 'anime awards':
        return <Image src="/icons/anime-awards.svg" {...iconProps} />;
      
      default:
        return <Image src="/icons/oscar.svg" {...iconProps} />;
    }
  };

  return (
    <div className={`${gradientClass} ${textClass} px-2 py-1 rounded-lg shadow-lg flex items-center gap-1 text-xs font-medium`}>
      {getAwardIcon()}
      <span>{labelText} {displayYear}</span>
    </div>
  );
};

export default AwardIcon;
