import { Filme, Genre } from '@/types';
import { format } from 'date-fns';

interface FilmeInfoBlockProps {
  filme: Filme | null;
}

const FilmeInfoBlock: React.FC<FilmeInfoBlockProps> = ({ filme }) => {
  if (!filme) {
    return <div>Carregando informações...</div>; 
  }

  const formatDuration = (minutes: number | null | undefined) => {
    if (typeof minutes !== 'number' || isNaN(minutes)) {
      return null;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${remainingMinutes > 0 ? `${remainingMinutes}m` : ''}`.trim();
    }
    return `${remainingMinutes}m`;
  };

  const director = (filme as any).crew?.find((member: any) => member.job === 'Director')?.name;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-1">{filme.titulo_curado || filme.titulo_api}</h1>
        {(filme.titulo_api && filme.titulo_api !== filme.titulo_curado) && (
          <h2 className="text-lg text-gray-400">{filme.titulo_api}</h2>
        )}
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div className="col-span-2">
          <span className="font-semibold text-yellow-600 dark:text-blue-400">Lançamento: </span>
          <span className="text-muted-foreground">{filme.data_lancamento_api ? format(new Date(filme.data_lancamento_api), 'dd/MM/yyyy') : 'N/A'}</span>
        </div>
        {filme.duracao && (
          <div>
            <span className="font-semibold text-yellow-600 dark:text-blue-400">Duração: </span>
            <span className="text-muted-foreground">{formatDuration(filme.duracao)}</span>
          </div>
        )}
        {director && (
          <div className="col-span-2">
            <span className="font-semibold text-yellow-600 dark:text-blue-400">Direção: </span>
            <span className="text-muted-foreground">{director}</span>
          </div>
        )}
        {filme.generos_api && filme.generos_api.length > 0 && (
          <div className="col-span-2">
            <span className="font-semibold text-yellow-600 dark:text-blue-400">Gêneros: </span>
            <div className="flex flex-wrap gap-2 mt-1">
              {filme.generos_api.map((genre: Genre) => (
                <span key={genre.id} className="bg-muted px-2 py-1 rounded-full text-xs text-muted-foreground">{genre.name}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilmeInfoBlock;