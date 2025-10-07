'use client';

import { Filme } from '@/types'; // Assuming this type exists
import { useTheme } from '@/hooks/useTheme';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FilmeInfoBlockProps {
  filme: Filme;
}

const formatDuration = (minutes: number | undefined) => {
  if (typeof minutes !== 'number' || isNaN(minutes) || minutes <= 0) {
    return 'N/A';
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${remainingMinutes > 0 ? `${remainingMinutes}m` : ''}`.trim();
  }
  return `${remainingMinutes}m`;
};

const FilmeInfoBlock: React.FC<FilmeInfoBlockProps> = ({ filme }) => {
  const { isDark } = useTheme();
  const labelColor = isDark ? 'text-blue-400' : 'text-yellow-500';

  const releaseDate = filme.data_lancamento_api ? format(new Date(filme.data_lancamento_api), 'dd/MM/yyyy', { locale: ptBR }) : 'N/A';

  return (
    <div className="flex-1 space-y-4">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground">{filme.titulo_curado || filme.titulo_api}</h1>
      
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div>
          <span className={`font-semibold ${labelColor} mr-2`}>Lançamento:</span>
          <span className="text-muted-foreground">{releaseDate}</span>
        </div>
        <div>
          <span className={`font-semibold ${labelColor} mr-2`}>Duração:</span>
          <span className="text-muted-foreground">{formatDuration(filme.duracao)}</span>
        </div>
        {filme.diretor && (
          <div className="col-span-2">
            <span className={`font-semibold ${labelColor} mr-2`}>Direção:</span>
            <span className="text-muted-foreground">{filme.diretor}</span>
          </div>
        )}
      </div>

      {filme.generos_api && filme.generos_api.length > 0 && (
        <div>
          <h4 className={`font-semibold ${labelColor} mb-2`}>Gêneros</h4>
          <div className="flex flex-wrap gap-2">
            {filme.generos_api.map((genre) => (
              <span key={genre.id} className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-xs font-medium">
                {genre.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilmeInfoBlock;
