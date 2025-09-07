'use client';

import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [isSystemTheme, setIsSystemTheme] = useState<boolean>(true);

  // Detecta o tema do sistema
  const getSystemTheme = (): boolean => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  };

  // Aplica o tema ao documento
  const applyTheme = (dark: boolean) => {
    const root = document.documentElement;
    
    if (dark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    setIsDark(dark);
  };

  // Inicialização - segue o tema do sistema por padrão
  useEffect(() => {
    const savedThemePreference = localStorage.getItem('orbe-nerd-manual-theme');
    
    if (savedThemePreference !== null) {
      // Usuário já definiu uma preferência manual
      const manualTheme = savedThemePreference === 'dark';
      setIsSystemTheme(false);
      applyTheme(manualTheme);
    } else {
      // Segue o tema do sistema
      const systemIsDark = getSystemTheme();
      setIsSystemTheme(true);
      applyTheme(systemIsDark);
    }
  }, []);

  // Escuta mudanças no tema do sistema (apenas se estiver seguindo o sistema)
  useEffect(() => {
    if (!isSystemTheme) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (isSystemTheme) {
        applyTheme(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [isSystemTheme]);

  // Função para alternar o tema manualmente
  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsSystemTheme(false);
    applyTheme(newTheme);
    localStorage.setItem('orbe-nerd-manual-theme', newTheme ? 'dark' : 'light');
  };

  // Função para voltar a seguir o tema do sistema
  const resetToSystem = () => {
    setIsSystemTheme(true);
    localStorage.removeItem('orbe-nerd-manual-theme');
    const systemIsDark = getSystemTheme();
    applyTheme(systemIsDark);
  };

  return {
    isDark,
    isSystemTheme,
    toggleTheme,
    resetToSystem
  };
};

