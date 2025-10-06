import { Anime, Genre } from '@/types';

interface AnimeInfoBlockProps {
  anime: Anime | null;
}

const AnimeInfoBlock: React.FC<AnimeInfoBlockProps> = ({ anime }) => {
  if (!anime) {
    return <div>Carregando informações...</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-1">{anime.titleEnglish || anime.titleRomaji}</h1>
        {(anime.titleRomaji || anime.titleNative) && (anime.titleEnglish !== (anime.titleRomaji || anime.titleNative)) && (
          <h2 className="text-lg text-gray-400">{anime.titleRomaji || anime.titleNative}</h2>
        )}
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div className="col-span-2">
          <span className="font-semibold text-yellow-600 dark:text-blue-400">Lançamento: </span>
          <span className="text-muted-foreground">{anime.startDate ? `${String(anime.startDate.day).padStart(2, '0')}/${String(anime.startDate.month).padStart(2, '0')}/${anime.startDate.year}` : 'N/A'}</span>
        </div>
        {anime.numero_episodios && (
          <div>
            <span className="font-semibold text-yellow-600 dark:text-blue-400">Episódios: </span>
            <span className="text-muted-foreground">{anime.numero_episodios}</span>
          </div>
        )}
        {anime.fonte && (
          <div>
            <span className="font-semibold text-yellow-600 dark:text-blue-400">Fonte: </span>
            <span className="text-muted-foreground">{anime.fonte}</span>
          </div>
        )}
        {anime.estudio && (
          <div className="col-span-2">
            <span className="font-semibold text-yellow-600 dark:text-blue-400">Estúdio: </span>
            <span className="text-muted-foreground">{anime.estudio}</span>
          </div>
        )}
        {anime.generos_api && anime.generos_api.length > 0 && (
          <div className="col-span-2">
            <span className="font-semibold text-yellow-600 dark:text-blue-400">Gêneros: </span>
            <div className="flex flex-wrap gap-2 mt-1">
              {anime.generos_api.map((genre: Genre) => (
                <span key={genre.id} className="bg-muted px-2 py-1 rounded-full text-xs text-muted-foreground">{genre.name}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimeInfoBlock;