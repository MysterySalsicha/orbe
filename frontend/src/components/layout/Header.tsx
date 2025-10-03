'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Search, 
  Bell, 
  User, 
  Menu, 
  X, 
  Sun, 
  Moon,
  LogOut,
  Heart
} from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useAppStore } from '@/stores/appStore';
import type { HeaderProps } from '@/types';

const Header: React.FC<HeaderProps> = ({ 
  notificationCount = 0,
  onThemeToggle 
}) => {
  const pathname = usePathname();
  const { isDark, toggleTheme } = useTheme();
  const { 
    openSearch, 
    openNotificationModal, 
    isAuthenticated,
    logout 
  } = useAppStore();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navigationLinks = [
    { href: '/filmes', label: 'Filmes' },
    { href: '/animes', label: 'Animes' },
    { href: '/series', label: 'Séries' },
    { href: '/jogos', label: 'Jogos' },
    { href: '/premios', label: 'Premiações' },
    { href: '/hoje', label: 'Hoje' },
    { href: '/apoie', label: 'Apoie o Projeto', icon: Heart },
  ];

  const isActiveLink = (href: string) => {
    return pathname === href;
  };

  const handleSearchClick = () => {
    openSearch();
    setIsMobileMenuOpen(false);
  };

  const handleNotificationClick = () => {
    openNotificationModal();
    setIsMobileMenuOpen(false);
  };

  const handleThemeToggle = () => {
    toggleTheme();
    onThemeToggle?.();
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="header-fixed transition-colors">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo e Navegação Principal */}
          <div className="flex items-center space-x-6">
            <Link 
              href="/" 
              className="flex items-center space-x-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="text-2xl font-bold orbe-gradient">
                Orbe Nerd
              </span>
            </Link>

            {/* Navegação Desktop */}
            <nav className="hidden md:flex items-center space-x-6">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary flex items-center ${
                    isActiveLink(link.href)
                      ? 'orbe-text-secondary border-b-2 border-primary'
                      : 'orbe-text-primary hover:orbe-text-secondary'
                  } ${link.href === '/apoie' ? 'text-rose-500 hover:text-rose-600' : ''}`}
                >
                  {link.icon && <link.icon className="mr-1 h-4 w-4" />}
                  {link.label}
                  {link.href === '/apoie' && <Heart className="ml-1 h-4 w-4 text-rose-500" />}
                </Link>
              ))}
            </nav>
          </div>

          {/* Ações da Direita */}
          <div className="flex items-center space-x-2">
            {/* Botão de Pesquisa - Visível apenas em mobile, pois a barra é visível em desktop */}
            <button
              onClick={handleSearchClick}
              className="md:hidden p-2 orbe-text-primary hover:orbe-text-secondary transition-colors rounded-md hover:bg-muted"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Botão de Tema */}
            <button
              onClick={handleThemeToggle}
              className="p-2 orbe-text-primary hover:orbe-text-secondary transition-colors rounded-md hover:bg-muted"
              title={isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Notificações */}
            <button
              onClick={handleNotificationClick}
              className="relative p-2 orbe-text-primary hover:orbe-text-secondary transition-colors rounded-md hover:bg-muted"
            >
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </button>

            {/* Ações do Usuário */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="p-2 orbe-text-primary hover:orbe-text-secondary transition-colors rounded-md hover:bg-muted"
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-md shadow-lg py-1 z-50">
                    <Link
                      href="/perfil"
                      className="flex items-center w-full px-3 py-2 text-sm hover:bg-muted transition-colors orbe-text-primary"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Meu Perfil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-3 py-2 text-sm hover:bg-muted transition-colors text-destructive"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium orbe-text-primary hover:orbe-text-secondary transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  Inscreva-se
                </Link>
              </div>
            )}

            {/* Botão do Menu Mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 orbe-text-primary hover:orbe-text-secondary transition-colors rounded-md hover:bg-muted"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Conteúdo do Menu Mobile */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4 bg-background/95 backdrop-blur-sm">
            {/* Pesquisa no Menu Mobile */}
            <div className="px-2 mb-4">
                <button
                onClick={handleSearchClick}
                className="flex w-full items-center space-x-2 px-3 py-2 text-sm text-muted-foreground bg-muted rounded-md hover:bg-muted/80 transition-colors"
                >
                <Search className="h-4 w-4" />
                <span>Pesquisar...</span>
                </button>
            </div>

            <nav className="flex flex-col space-y-2 px-2">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-base font-medium transition-colors px-3 py-2 rounded-md flex items-center ${isActiveLink(link.href) ? 'orbe-text-secondary bg-muted' : 'orbe-text-primary hover:orbe-text-secondary hover:bg-muted'} ${link.href === '/apoie' ? 'text-rose-500 hover:text-rose-600' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.icon && <link.icon className="mr-2 h-5 w-5" />}
                  {link.label}
                </Link>
              ))}
              
              {!isAuthenticated && (
                <div className="flex flex-col space-y-2 pt-4 border-t border-border mt-4">
                  <Link
                    href="/login"
                    className="text-base font-medium orbe-text-primary hover:orbe-text-secondary transition-colors px-3 py-2 rounded-md hover:bg-muted"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Entrar
                  </Link>
                  <Link
                    href="/register"
                    className="text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors px-3 py-2 rounded-md text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Inscreva-se
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>

      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;