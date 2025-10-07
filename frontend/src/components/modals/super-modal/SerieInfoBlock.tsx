
import { Serie } from '@/types';
import { useTheme } from '@/hooks/useTheme';

interface SerieInfoBlockProps {
  serie: Serie;
}

const SerieInfoBlock = ({ serie }: SerieInfoBlockProps) => {
  const { isDark } = useTheme();

  const labelColor = isDark ? 'text-blue-400' : 'text-yellow-500';

  const creators = serie.criadores?.map((creator) => creator.nome).join(', ');
  const releaseYear = serie.data_lancamento_api ? new Date(serie.data_lancamento_api).getFullYear() : 'N/A';

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl md:text-4xl font-bold">{serie.titulo_curado || serie.titulo_api}</h1>
      
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 text-sm md:text-base">
        <div className="flex">
          <span className={`font-semibold ${labelColor} mr-2`}>Lançamento:</span>
          <span>{releaseYear}</span>
        </div>
        <div className="flex">
          <span className={`font-semibold ${labelColor} mr-2`}>Temporadas:</span>
          <span>{serie.numero_temporadas}</span>
        </div>
        <div className="flex">
          <span className={`font-semibold ${labelColor} mr-2`}>Episódios:</span>
          <span>{serie.numero_episodios}</span>
        </div>
        {creators && (
          <div className="flex col-span-2">
            <span className={`font-semibold ${labelColor} mr-2`}>Criadores:</span>
            <span>{creators}</span>
          </div>
        )}
      </div>

      <div className="mt-4">
        <span className={`font-semibold ${labelColor}`}>Gêneros:</span>
        <div className="flex flex-wrap gap-2 mt-2">
          {serie.generos_api?.map((genre) => (
            <span key={genre.id} className="bg-gray-700 text-white px-3 py-1 rounded-full text-xs">
              {genre.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SerieInfoBlock;
