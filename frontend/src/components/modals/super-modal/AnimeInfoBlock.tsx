'use client';

import { Anime } from '@/types';
import { useTheme } from '@/hooks/useTheme';
import { ExternalLink } from 'lucide-react';

interface AnimeInfoBlockProps {
  anime: Anime;
}

const AnimeInfoBlock: React.FC<AnimeInfoBlockProps> = ({ anime }) => {
  const { isDark } = useTheme();
  const labelColor = isDark ? 'text-blue-400' : 'text-yellow-500';

  const dubStatus = anime.dublagem_info ? 'Dublado' : 'Legendado';

  return (
    <div className="flex-1 space-y-4">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground">{anime.titleEnglish || anime.titleRomaji}</h1>
      {anime.titleRomaji && anime.titleRomaji !== anime.titleEnglish && (
        <h2 className="text-lg md:text-xl text-gray-400 -mt-2">{anime.titleRomaji}</h2>
      )}
      {anime.titleNative && anime.titleNative !== anime.titleRomaji && (
         <h2 className="text-md md:text-lg text-gray-500 -mt-2">{anime.titleNative}</h2>
      )}
      
      <div className="space-y-2 text-sm">
        <div>
          <span className={`font-semibold ${labelColor} mr-2`}>Fonte:</span>
          <span className="text-muted-foreground">{anime.fonte}</span>
        </div>
        {anime.estudio && (
          <div>
            <span className={`font-semibold ${labelColor} mr-2`}>Estúdio:</span>
            <span className="text-muted-foreground">{anime.estudio}</span>
          </div>
        )}
        <div>
          <span className={`font-semibold ${labelColor} mr-2`}>Status de Dublagem:</span>
          <span className="text-muted-foreground">{dubStatus}</span>
        </div>
      </div>

      {anime.mal_link && (
        <a 
          href={anime.mal_link} 
          target="_blank" 
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 text-sm font-semibold ${labelColor} hover:underline`}
        >
          Ver no MyAnimeList <ExternalLink size={16} />
        </a>
      )}
    </div>
  );
};

export default AnimeInfoBlock;
