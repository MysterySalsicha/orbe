import { Serie, Genre, Creator } from '@/types';
import { format } from 'date-fns';

interface SerieInfoBlockProps {
  serie: Serie | null;
}

const SerieInfoBlock: React.FC<SerieInfoBlockProps> = ({ serie }) => {
  if (!serie) {
    return <div>Carregando informações...</div>;
  }

  const creators = serie.criadores?.map((c: Creator) => c.nome).join(', ');

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-1">{serie.titulo_curado || serie.titulo_api}</h1>
        {(serie.titulo_api && serie.titulo_api !== serie.titulo_curado) && (
          <h2 className="text-lg text-gray-400">{serie.titulo_api}</h2>
        )}
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div className="col-span-2">
          <span className="font-semibold text-yellow-600 dark:text-blue-400">Lançamento: </span>
          <span className="text-muted-foreground">{serie.data_lancamento_api ? format(new Date(serie.data_lancamento_api), 'dd/MM/yyyy') : 'N/A'}</span>
        </div>
        {serie.numero_temporadas && (
          <div>
            <span className="font-semibold text-yellow-600 dark:text-blue-400">Temporadas: </span>
            <span className="text-muted-foreground">{serie.numero_temporadas}</span>
          </div>
        )}
        {serie.numero_episodios && (
          <div>
            <span className="font-semibold text-yellow-600 dark:text-blue-400">Episódios: </span>
            <span className="text-muted-foreground">{serie.numero_episodios}</span>
          </div>
        )}
        {creators && (
          <div className="col-span-2">
            <span className="font-semibold text-yellow-600 dark:text-blue-400">Criador(es): </span>
            <span className="text-muted-foreground">{creators}</span>
          </div>
        )}
        {serie.generos_api && serie.generos_api.length > 0 && (
          <div className="col-span-2">
            <span className="font-semibold text-yellow-600 dark:text-blue-400">Gêneros: </span>
            <div className="flex flex-wrap gap-2 mt-1">
              {serie.generos_api.map((genre: Genre) => (
                <span key={genre.id} className="bg-muted px-2 py-1 rounded-full text-xs text-muted-foreground">{genre.name}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SerieInfoBlock;