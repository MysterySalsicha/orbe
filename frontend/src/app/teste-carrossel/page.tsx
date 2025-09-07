'use client';

import React, { useRef } from 'react'; // Added useRef
import Carousel from '@/components/media/Carousel';
import type { Midia } from '@/types';

// Dados de teste para o carrossel
const mockData: Midia[] = [
  {
    id: 1,
    titulo: 'Stranger Things',
    poster: '/api/placeholder/200/300',
    ano: 2022,
    tipo: 'serie',
    avaliacao: 8.5,
    sinopse: 'Uma série de ficção científica sobre um grupo de crianças em uma cidade pequena.',
    plataformas_curadas: ['Netflix'],
    premiacoes: [
      { nome: 'Emmy', status: 'vencedor', ano: 2022 },
      { nome: 'Globo de Ouro', status: 'indicado', ano: 2022 }
    ]
  },
  {
    id: 2,
    titulo: 'The Mandalorian',
    poster: '/api/placeholder/200/300',
    ano: 2023,
    tipo: 'serie',
    avaliacao: 9.1,
    sinopse: 'As aventuras de um caçador de recompensas na galáxia de Star Wars.',
    plataformas_curadas: ['Disney+'],
    premiacoes: [
      { nome: 'Emmy', status: 'vencedor', ano: 2023 }
    ]
  },
  {
    id: 3,
    titulo: 'House of the Dragon',
    poster: '/api/placeholder/200/300',
    ano: 2022,
    tipo: 'serie',
    avaliacao: 8.7,
    sinopse: 'A história da Casa Targaryen 200 anos antes dos eventos de Game of Thrones.',
    plataformas_curadas: ['HBO Max'],
    premiacoes: [
      { nome: 'Globo de Ouro', status: 'vencedor', ano: 2022 }
    ]
  },
  {
    id: 4,
    titulo: 'The Boys',
    poster: '/api/placeholder/200/300',
    ano: 2022,
    tipo: 'serie',
    avaliacao: 8.4,
    sinopse: 'Um grupo de vigilantes que luta contra super-heróis corruptos.',
    plataformas_curadas: ['Prime Video'],
    premiacoes: [
      { nome: 'Emmy', status: 'indicado', ano: 2022 }
    ]
  },
  {
    id: 5,
    titulo: 'The Witcher',
    poster: '/api/placeholder/200/300',
    ano: 2021,
    tipo: 'serie',
    avaliacao: 8.2,
    sinopse: 'As aventuras de Geralt de Rivia, um caçador de monstros mutante.',
    plataformas_curadas: ['Netflix'],
    premiacoes: [
      { nome: 'Saturn Awards', status: 'vencedor', ano: 2021 }
    ]
  },
  {
    id: 6,
    titulo: 'Loki',
    poster: '/api/placeholder/200/300',
    ano: 2021,
    tipo: 'serie',
    avaliacao: 8.9,
    sinopse: 'As aventuras do Deus da Trapaça após os eventos de Avengers: Endgame.',
    plataformas_curadas: ['Disney+'],
    premiacoes: [
      { nome: 'Emmy', status: 'indicado', ano: 2021 }
    ]
  },
  {
    id: 7,
    titulo: 'Euphoria',
    poster: '/api/placeholder/200/300',
    ano: 2022,
    tipo: 'serie',
    avaliacao: 8.6,
    sinopse: 'Uma série sobre adolescentes lidando com drogas, sexo e violência.',
    plataformas_curadas: ['HBO Max'],
    premiacoes: [
      { nome: 'Emmy', status: 'vencedor', ano: 2022 }
    ]
  },
  {
    id: 8,
    titulo: 'The Crown',
    poster: '/api/placeholder/200/300',
    ano: 2022,
    tipo: 'serie',
    avaliacao: 8.8,
    sinopse: 'A história da família real britânica durante o século XX.',
    plataformas_curadas: ['Netflix'],
    premiacoes: [
      { nome: 'Oscar', status: 'indicado', ano: 2022 },
      { nome: 'Globo de Ouro', status: 'vencedor', ano: 2022 }
    ]
  }
];

const TesteCarrosselPage: React.FC = () => {
  const carouselRef1 = useRef<HTMLDivElement>(null);
  const carouselRef2 = useRef<HTMLDivElement>(null);
  const carouselRef3 = useRef<HTMLDivElement>(null);

  const handleTitleClick = (ref: React.RefObject<HTMLDivElement>) => {
    console.log('handleTitleClick called. Ref:', ref);
    if (ref.current) {
      console.log('Ref current is valid. Scrolling to 0.', ref.current);
      ref.current.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      console.log('Ref current is NULL.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Teste de Carrossel - Orbe Nerd</h1>
          <p className="text-lg text-gray-600 mb-8">
            Teste a funcionalidade de arrastar com o mouse no carrossel abaixo
          </p>
        </div>

        {/* Instruções */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">Como Testar:</h2>
          <ul className="space-y-2 text-blue-700">
            <li>• <strong>Roda do Mouse:</strong> Use a roda do mouse para rolar horizontalmente</li>
            <li>• <strong>Arrastar:</strong> Clique e segure o botão esquerdo do mouse, depois arraste para a esquerda ou direita</li>
            <li>• <strong>Botões de Navegação:</strong> Use os botões de seta para navegar</li>
            <li>• <strong>Teclado:</strong> Use as setas esquerda/direita do teclado</li>
            <li>• <strong>Barra de Rolagem:</strong> Aparece quando você rola o carrossel ou passa o mouse sobre ela</li>
            <li>• <strong>Mobile:</strong> Toque e arraste no dispositivo móvel</li>
          </ul>
        </div>

        {/* Carrossel de Teste */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Séries em Destaque</h2>
          <Carousel
            ref={carouselRef1} // Pass ref
            title="Séries em Destaque"
            items={mockData}
            type="serie"
            showNavigation={true}
            onTitleClick={() => handleTitleClick(carouselRef1)} // Use handleTitleClick
            onNavigate={(direction) => console.log('Navegação:', direction)}
          />
        </div>

        {/* Carrossel com Menos Itens */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Séries Limitadas</h2>
          <Carousel
            ref={carouselRef2} // Pass ref
            title="Séries Limitadas"
            items={mockData.slice(0, 3)}
            type="serie"
            showNavigation={true}
            onTitleClick={() => handleTitleClick(carouselRef2)} // Use handleTitleClick
          />
        </div>

        {/* Carrossel sem Navegação */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Apenas Arrastar</h2>
          <Carousel
            ref={carouselRef3} // Pass ref
            title="Apenas Arrastar"
            items={mockData}
            type="serie"
            showNavigation={false}
            onTitleClick={() => {
              console.log('onTitleClick fired for carouselRef3');
              handleTitleClick(carouselRef3);
            }} // Use handleTitleClick
          />
        </div>

        {/* Status do Teste */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-green-800">Status do Teste:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-green-700">
            <div>
              <h3 className="font-medium mb-2">Funcionalidades Implementadas:</h3>
              <ul className="space-y-1 text-sm">
                <li>✅ Roda do mouse (scroll horizontal)</li>
                <li>✅ Drag com mouse (clique e arraste)</li>
                <li>✅ Momentum após soltar o mouse</li>
                <li>✅ Barra de rolagem no hover</li>
                <li>✅ Indicador visual de progresso</li>
                <li>✅ Limitação de scroll nos limites</li>
                <li>✅ Navegação com botões</li>
                <li>✅ Navegação com teclado</li>
                <li>✅ Suporte a touch (mobile)</li>
                <li>✅ Cursor visual (grab/grabbing)</li>
                <li>✅ Scroll suave</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Melhorias de Fluidez:</h3>
              <ul className="space-y-1 text-sm">
                <li>✅ RequestAnimationFrame para suavidade</li>
                <li>✅ Velocidade de drag otimizada</li>
                <li>✅ Scroll com roda do mouse fluido</li>
                <li>✅ Botões de navegação suaves</li>
                <li>✅ CSS otimizado para performance</li>
                <li>✅ Cleanup de animation frames</li>
                <li>✅ Prevenção de seleção de texto</li>
                <li>✅ Responsividade mantida</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TesteCarrosselPage;
iv>
        </div>
      </div>
    </div>
  );
};

export default TesteCarrosselPage;
