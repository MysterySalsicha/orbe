'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  X, 
  Play, 
  Calendar, 
  Clock, 
  Star, 
  Heart, 
  Bookmark, 
  Eye, 
  EyeOff,
  Edit,
  ExternalLink,
  ShoppingCart,
  Check
} from 'lucide-react';
import PlatformIcon from '@/components/ui/PlatformIcons';
import AwardIcon from '@/components/ui/AwardIcons';
import { useAppStore } from '@/stores/appStore';
import { mockApi } from '@/data/mockData';
import type { Filme, Serie, Anime, Jogo, Elenco, Staff, Personagem } from '@/types';

const SuperModal: React.FC = () => {
  const { isSuperModalOpen, superModalData, closeSuperModal, isAuthenticated } = useAppStore();
  const [elenco, setElenco] = useState<Elenco[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [personagens, setPersonagens] = useState<Personagem[]>([]);
  const [selectedDubbing, setSelectedDubbing] = useState<'jp' | 'pt-br'>('jp');
  const [isLoading, setIsLoading] = useState(false);
  const [userInteraction, setUserInteraction] = useState({
    favorited: false,
    wantToWatch: false,
    watching: false,
    watched: false,
    notInterested: false
  });

  const { midia, type } = superModalData;

  // Carrega dados adicionais quando o modal abre
  useEffect(() => {
    if (isSuperModalOpen && midia) {
      loadAdditionalData();
    }
  }, [isSuperModalOpen, midia]);

  const loadAdditionalData = async () => {
    if (!midia || !type) return;
    
    setIsLoading(true);
    try {
      if (type === 'filme') {
        const elencoData = await mockApi.getElenco(midia.id);
        setElenco(elencoData);
      } else if (type === 'anime') {
        const [staffData, personagensData] = await Promise.all([
          mockApi.getStaff(midia.id),
          mockApi.getPersonagens(midia.id)
        ]);
        setStaff(staffData);
        setPersonagens(personagensData);
      }
    } catch (error) {
      console.error('Erro ao carregar dados adicionais:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setElenco([]);
    setStaff([]);
    setPersonagens([]);
    closeSuperModal();
  };

  const handleInteraction = (action: keyof typeof userInteraction) => {
    setUserInteraction(prev => ({
      ...prev,
      [action]: !prev[action]
    }));
  };

  const renderFilmeContent = (filme: Filme) => (
    <div className="space-y-6">
      {/* Informações Básicas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold orbe-text-secondary mb-3">Informações</h3>
          <div className="space-y-2 text-sm">
            <div><span className="font-medium">Duração:</span> {filme.duracao || 'N/A'}</div>
            <div><span className="font-medium">Direção:</span> {filme.direcao || 'N/A'}</div>
            <div><span className="font-medium">Roteiro:</span> {filme.roteiro || 'N/A'}</div>
            <div><span className="font-medium">Gênero:</span> {filme.generos?.join(', ') || 'N/A'}</div>
          </div>
        </div>
        
        {/* Botões de Ação */}
        <div className="space-y-3">
          {filme.em_cartaz && (
            <button className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Comprar Ingresso
            </button>
          )}
          
          {filme.plataformas_curadas && filme.plataformas_curadas.length > 0 && (
            <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
              <Play className="h-4 w-4" />
              Assistir
            </button>
          )}
          
          <button className="w-full bg-muted orbe-text-primary px-4 py-2 rounded-lg hover:bg-muted/80 transition-colors flex items-center justify-center gap-2">
            <Calendar className="h-4 w-4" />
            Adicionar ao Calendário
          </button>
        </div>
      </div>

      {/* Elenco */}
      {elenco.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold orbe-text-secondary mb-3">Elenco</h3>
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
            {elenco.map((ator) => (
              <div key={ator.id} className="flex-shrink-0 text-center">
                <div className="w-20 h-20 bg-muted rounded-full mb-2 overflow-hidden">
                  {ator.foto && (
                    <Image
                      src={ator.foto}
                      alt={ator.nome}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <p className="text-xs font-medium orbe-text-primary">{ator.nome}</p>
                <p className="text-xs text-muted-foreground">{ator.personagem}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderSerieContent = (serie: Serie) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold orbe-text-secondary mb-3">Informações</h3>
          <div className="space-y-2 text-sm">
            <div><span className="font-medium">Temporadas:</span> {serie.numero_temporadas || 'N/A'}</div>
            <div><span className="font-medium">Episódios:</span> {serie.numero_episodios || 'N/A'}</div>
            <div><span className="font-medium">Criadores:</span> {serie.criadores?.join(', ') || 'N/A'}</div>
            <div><span className="font-medium">Status:</span> {serie.status || 'N/A'}</div>
          </div>
        </div>
        
        <div className="space-y-3">
          {serie.plataformas_curadas && serie.plataformas_curadas.length > 0 && (
            <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
              <Play className="h-4 w-4" />
              Assistir
            </button>
          )}
          
          <button className="w-full bg-muted orbe-text-primary px-4 py-2 rounded-lg hover:bg-muted/80 transition-colors flex items-center justify-center gap-2">
            <Calendar className="h-4 w-4" />
            Adicionar ao Calendário
          </button>
        </div>
      </div>
    </div>
  );

  const renderAnimeContent = (anime: Anime) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold orbe-text-secondary mb-3">Informações</h3>
          <div className="space-y-2 text-sm">
            <div><span className="font-medium">Fonte:</span> {anime.fonte || 'N/A'}</div>
            <div><span className="font-medium">Estúdio:</span> {anime.estudio || 'N/A'}</div>
            <div><span className="font-medium">Status Dublagem:</span> {anime.status_dublagem || 'N/A'}</div>
            <div><span className="font-medium">Episódios:</span> {anime.numero_episodios || 'N/A'}</div>
            {anime.proximo_episodio && (
              <div><span className="font-medium">Próximo Episódio:</span> {anime.proximo_episodio}</div>
            )}
          </div>
        </div>
        
        <div className="space-y-3">
          {anime.plataformas_curadas && anime.plataformas_curadas.length > 0 && (
            <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
              <Play className="h-4 w-4" />
              Assistir
            </button>
          )}
          
          <button className="w-full bg-muted orbe-text-primary px-4 py-2 rounded-lg hover:bg-muted/80 transition-colors flex items-center justify-center gap-2">
            <Calendar className="h-4 w-4" />
            Adicionar ao Calendário
          </button>
        </div>
      </div>

      {/* Staff */}
      {staff.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold orbe-text-secondary mb-3">Equipe de Produção</h3>
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
            {staff.map((membro) => (
              <div key={membro.id} className="flex-shrink-0 text-center">
                <div className="w-20 h-20 bg-muted rounded-full mb-2 overflow-hidden">
                  {membro.foto && (
                    <Image
                      src={membro.foto}
                      alt={membro.nome}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <p className="text-xs font-medium orbe-text-primary">{membro.nome}</p>
                <p className="text-xs text-muted-foreground">{membro.funcao}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Personagens com Seletor de Dublagem */}
      {personagens.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold orbe-text-secondary">Personagens</h3>
            <div className="flex bg-muted rounded-lg p-1">
              <button
                onClick={() => setSelectedDubbing('jp')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  selectedDubbing === 'jp' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'orbe-text-primary hover:bg-muted/80'
                }`}
              >
                JP
              </button>
              <button
                onClick={() => setSelectedDubbing('pt-br')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  selectedDubbing === 'pt-br' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'orbe-text-primary hover:bg-muted/80'
                }`}
              >
                PT-BR
              </button>
            </div>
          </div>
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
            {personagens.map((personagem) => (
              <div key={personagem.id} className="flex-shrink-0 text-center">
                <div className="w-20 h-20 bg-muted rounded-full mb-2 overflow-hidden">
                  {personagem.imagem && (
                    <Image
                      src={personagem.imagem}
                      alt={personagem.nome}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <p className="text-xs font-medium orbe-text-primary">{personagem.nome}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedDubbing === 'jp' ? personagem.dublador_jp : personagem.dublador_pt_br}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderJogoContent = (jogo: Jogo) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold orbe-text-secondary mb-3">Informações</h3>
          <div className="space-y-2 text-sm">
            <div><span className="font-medium">Desenvolvedores:</span> {jogo.desenvolvedores?.join(', ') || 'N/A'}</div>
            <div><span className="font-medium">Publicadoras:</span> {jogo.publicadoras?.join(', ') || 'N/A'}</div>
            <div><span className="font-medium">Plataformas:</span> {jogo.plataformas_curadas?.join(', ') || 'N/A'}</div>
            <div><span className="font-medium">Gênero:</span> {jogo.generos?.join(', ') || 'N/A'}</div>
          </div>
        </div>
        
        {/* Ícones das Lojas */}
        <div>
          <h3 className="text-lg font-semibold orbe-text-secondary mb-3">Onde Comprar</h3>
          <div className="flex flex-wrap gap-3">
            {jogo.lojas_digitais?.map((loja) => (
              <button
                key={loja.nome}
                onClick={() => window.open(loja.url, '_blank')}
                className="flex items-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="text-sm">{loja.nome}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (!isSuperModalOpen || !midia || !type) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-background rounded-lg shadow-xl max-w-4xl mx-auto">
          {/* Header */}
          <div className="relative">
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              {isAuthenticated && (
                <button className="p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors">
                  <Edit className="h-5 w-5 orbe-text-primary" />
                </button>
              )}
              <button
                onClick={handleClose}
                className="p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
              >
                <X className="h-5 w-5 orbe-text-primary" />
              </button>
            </div>

            {/* Poster e Informações Principais */}
            <div className="flex flex-col md:flex-row gap-6 p-6">
              <div className="flex-shrink-0">
                <div className="w-48 h-72 bg-muted rounded-lg overflow-hidden">
                  <Image
                    src={midia.poster_curado || midia.poster_url_api || '/placeholder-poster.jpg'}
                    alt={midia.titulo_curado}
                    width={192}
                    height={288}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold orbe-text-primary mb-2">
                    {midia.titulo_curado}
                  </h1>
                  {midia.titulo_api !== midia.titulo_curado && (
                    <p className="text-lg text-muted-foreground">{midia.titulo_api}</p>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {midia.data_lancamento_curada || midia.data_lancamento_api}
                  </div>
                  {midia.avaliacao && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {midia.avaliacao}
                    </div>
                  )}
                </div>

                {/* Prêmios */}
                {midia.premiacoes && midia.premiacoes.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium orbe-text-secondary">Prêmios:</span>
                    <div className="flex gap-1 flex-wrap">
                      {midia.premiacoes.map((award, index) => (
                        <AwardIcon
                          key={index}
                          award={award.nome}
                          status={award.status}
                          year={award.ano}
                          className="h-4 w-4"
                          size={16}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {midia.sinopse && (
                  <p className="text-muted-foreground leading-relaxed">
                    {midia.sinopse}
                  </p>
                )}

                {/* Plataformas */}
                {(midia.plataformas_curadas || midia.plataformas_api) && (midia.plataformas_curadas || midia.plataformas_api)?.length > 0 && (
                  <div>
                    <h4 className="font-medium orbe-text-secondary mb-2">Disponível em:</h4>
                    <div className="flex flex-wrap gap-2">
                      {(midia.plataformas_curadas || midia.plataformas_api)?.map((plataforma) => (
                        <div
                          key={plataforma}
                          className="flex items-center gap-1 px-2 py-1 bg-muted rounded text-xs"
                        >
                          <PlatformIcon 
                            platform={plataforma} 
                            className="h-3 w-3" 
                            size={12}
                          />
                          <span>{plataforma}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ações do Usuário */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleInteraction('favorited')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      userInteraction.favorited
                        ? 'bg-red-600 text-white'
                        : 'bg-muted orbe-text-primary hover:bg-muted/80'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${userInteraction.favorited ? 'fill-current' : ''}`} />
                    Favoritar
                  </button>
                  
                  <button
                    onClick={() => handleInteraction('wantToWatch')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      userInteraction.wantToWatch
                        ? 'bg-blue-600 text-white'
                        : 'bg-muted orbe-text-primary hover:bg-muted/80'
                    }`}
                  >
                    <Bookmark className={`h-4 w-4 ${userInteraction.wantToWatch ? 'fill-current' : ''}`} />
                    Quero Assistir
                  </button>
                  
                  <button
                    onClick={() => handleInteraction('watching')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      userInteraction.watching
                        ? 'bg-green-600 text-white'
                        : 'bg-muted orbe-text-primary hover:bg-muted/80'
                    }`}
                  >
                    <Eye className={`h-4 w-4 ${userInteraction.watching ? 'fill-current' : ''}`} />
                    Acompanhando
                  </button>
                  
                  <button
                    onClick={() => handleInteraction('watched')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      userInteraction.watched
                        ? 'bg-green-600 text-white'
                        : 'bg-muted orbe-text-primary hover:bg-muted/80'
                    }`}
                  >
                    <Check className={`h-4 w-4 ${userInteraction.watched ? 'fill-current' : ''}`} />
                    {type === 'jogo' ? 'Já Joguei' : 'Já Assisti'}
                  </button>
                  
                  <button
                    onClick={() => handleInteraction('notInterested')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      userInteraction.notInterested
                        ? 'bg-gray-600 text-white'
                        : 'bg-muted orbe-text-primary hover:bg-muted/80'
                    }`}
                  >
                    <EyeOff className={`h-4 w-4 ${userInteraction.notInterested ? 'fill-current' : ''}`} />
                    Não me Interessa
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Conteúdo Específico por Tipo */}
          <div className="px-6 pb-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                {type === 'filme' && renderFilmeContent(midia as Filme)}
                {type === 'serie' && renderSerieContent(midia as Serie)}
                {type === 'anime' && renderAnimeContent(midia as Anime)}
                {type === 'jogo' && renderJogoContent(midia as Jogo)}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperModal;

