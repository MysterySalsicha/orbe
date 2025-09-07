'use client';

import { useAppStore } from '@/stores/appStore';
import { User, Settings, Heart, Bookmark, Eye } from 'lucide-react';

export default function PerfilPage() {
  const { user, isAuthenticated } = useAppStore();

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold orbe-text-primary mb-4">
            Acesso Restrito
          </h2>
          <p className="text-muted-foreground mb-6">
            Você precisa estar logado para acessar seu perfil.
          </p>
          <a
            href="/login"
            className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Fazer Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold orbe-text-primary mb-8">Meu Perfil</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Informações do Usuário */}
          <div className="md:col-span-1">
            <div className="bg-muted/50 rounded-lg p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-primary-foreground" />
                </div>
                <h2 className="text-xl font-semibold orbe-text-primary">{user?.nome}</h2>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
              
              <div className="space-y-4">
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-background rounded-lg hover:bg-muted/80 transition-colors">
                  <Settings className="h-4 w-4" />
                  <span>Configurações</span>
                </button>
              </div>
            </div>
          </div>

          {/* Estatísticas e Listas */}
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <Heart className="h-6 w-6 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold orbe-text-primary">0</div>
                <div className="text-sm text-muted-foreground">Favoritos</div>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <Bookmark className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold orbe-text-primary">0</div>
                <div className="text-sm text-muted-foreground">Quero Assistir</div>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <Eye className="h-6 w-6 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold orbe-text-primary">0</div>
                <div className="text-sm text-muted-foreground">Assistidos</div>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold orbe-text-primary mb-4">Atividade Recente</h3>
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Nenhuma atividade recente encontrada.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

