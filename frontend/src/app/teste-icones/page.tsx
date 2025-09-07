'use client';

import React from 'react';
import AwardIcon from '@/components/ui/AwardIcons';
import PlatformIcon from '@/components/ui/PlatformIcons';

const TesteIconesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Teste de Ícones - Orbe Nerd</h1>
        
        {/* Teste de Ícones de Prêmios */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Ícones de Prêmios</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">Vencedores</h3>
              <div className="space-y-3">
                <AwardIcon award="oscar" status="vencedor" year={2024} />
                <AwardIcon award="globo de ouro" status="vencedor" year={2024} />
                <AwardIcon award="the game awards" status="vencedor" year={2024} />
                <AwardIcon award="the anime awards" status="vencedor" year={2024} />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">Indicados</h3>
              <div className="space-y-3">
                <AwardIcon award="oscar" status="indicado" year={2024} />
                <AwardIcon award="globo de ouro" status="indicado" year={2024} />
                <AwardIcon award="the game awards" status="indicado" year={2024} />
                <AwardIcon award="the anime awards" status="indicado" year={2024} />
              </div>
            </div>
          </div>
        </section>

        {/* Teste de Ícones de Plataformas de Streaming */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Plataformas de Streaming</h2>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <PlatformIcon platform="netflix" size={24} />
                <span>Netflix</span>
              </div>
              <div className="flex items-center gap-2">
                <PlatformIcon platform="disney+" size={24} />
                <span>Disney+</span>
              </div>
              <div className="flex items-center gap-2">
                <PlatformIcon platform="hbo max" size={24} />
                <span>HBO Max</span>
              </div>
              <div className="flex items-center gap-2">
                <PlatformIcon platform="prime video" size={24} />
                <span>Prime Video</span>
              </div>
              <div className="flex items-center gap-2">
                <PlatformIcon platform="apple tv+" size={24} />
                <span>Apple TV+</span>
              </div>
              <div className="flex items-center gap-2">
                <PlatformIcon platform="crunchyroll" size={24} />
                <span>Crunchyroll</span>
              </div>
              <div className="flex items-center gap-2">
                <PlatformIcon platform="star+" size={24} />
                <span>Star+</span>
              </div>
            </div>
          </div>
        </section>

        {/* Teste de Ícones de Plataformas de Jogos */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Plataformas de Jogos</h2>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <PlatformIcon platform="playstation" size={24} />
                <span>PlayStation</span>
              </div>
              <div className="flex items-center gap-2">
                <PlatformIcon platform="xbox" size={24} />
                <span>Xbox</span>
              </div>
              <div className="flex items-center gap-2">
                <PlatformIcon platform="nintendo switch" size={24} />
                <span>Nintendo Switch</span>
              </div>
              <div className="flex items-center gap-2">
                <PlatformIcon platform="steam" size={24} />
                <span>Steam</span>
              </div>
              <div className="flex items-center gap-2">
                <PlatformIcon platform="pc" size={24} />
                <span>PC</span>
              </div>
            </div>
          </div>
        </section>

        {/* Teste de Responsividade */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Teste de Responsividade</h2>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Tamanhos Diferentes</h3>
                <div className="flex items-center gap-4">
                  <PlatformIcon platform="netflix" size={16} />
                  <PlatformIcon platform="netflix" size={24} />
                  <PlatformIcon platform="netflix" size={32} />
                  <PlatformIcon platform="netflix" size={48} />
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Classes CSS</h3>
                <div className="flex items-center gap-4">
                  <PlatformIcon platform="netflix" className="h-4 w-4" />
                  <PlatformIcon platform="netflix" className="h-6 w-6" />
                  <PlatformIcon platform="netflix" className="h-8 w-8" />
                  <PlatformIcon platform="netflix" className="h-12 w-12" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TesteIconesPage;

